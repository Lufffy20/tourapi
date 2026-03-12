module.exports = {

    friendlyName: 'Verify email',

    description: 'Verify a newly-registered user\'s email address.',

    inputs: {
        token: {
            description: 'The verification token from the email.',
            example: '4f9c3601-d2bf-408a-9f93-875f2f534127',
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
            description: 'Email address confirmed and user logged in.',
            responseType: 'redirect'
        },
        invalidOrExpiredToken: {
            responseType: 'badRequest',
            description: 'The provided token is invalid, expired, or has already been used.',
        }
    },

    fn: async function ({ token }) {

        // First try to find the user with this token
        var userRecord = await User.findOne({ emailProofToken: token });

        // If no such user exists, or their token is expired, bail.
        if (!userRecord || userRecord.emailProofTokenExpiresAt <= Date.now()) {
            throw 'invalidOrExpiredToken';
        }

        // Mark the user's email as confirmed and clear their token/expiration.
        await User.updateOne({ id: userRecord.id })
            .set({
                emailStatus: 'confirmed',
                emailProofToken: '',
                emailProofTokenExpiresAt: 0
            });

        // Create a Stripe customer if they don't have one yet
        if (!userRecord.stripeCustomerId) {
            try {
                const stripeCustomerId = await sails.helpers.stripeCreateCustomer.with({
                    email: userRecord.email,
                    name: `${userRecord.firstName} ${userRecord.lastName}`
                });

                await User.updateOne({ id: userRecord.id })
                    .set({ stripeCustomerId: stripeCustomerId });

                sails.log.info(`Created Stripe customer for user ${userRecord.id}: ${stripeCustomerId}`);
            } catch (error) {
                sails.log.error(`Failed to create Stripe customer for user ${userRecord.id}:`, error);
                // We don't throw an error here because the email is already verified
                // We might want to handle this differently in a real app (e.g., job queue)
            }
        }

        // Redirect to the frontend login page with a success flag
        return `${sails.config.custom.frontendUrl}/login?verified=true`;
    }
};
