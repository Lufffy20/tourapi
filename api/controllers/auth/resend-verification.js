module.exports = {

    friendlyName: 'Resend verification email',

    description: 'Resends the email verification link to a user who has not yet verified their email.',

    inputs: {
        email: {
            description: 'The email address of the user who needs the verification link resent.',
            type: 'string',
            isEmail: true,
            required: true
        }
    },

    exits: {
        success: {
            description: 'The verification email was resent successfully.'
        },
        emailAlreadyVerified: {
            statusCode: 400,
            description: 'The provided email address is already verified.'
        },
        userNotFound: {
            statusCode: 404,
            description: 'No user was found with the provided email address.'
        }
    },

    fn: async function ({ email }) {

        const userRecord = await User.findOne({ email: email.toLowerCase() });

        if (!userRecord) {
            throw 'userNotFound';
        }

        if (userRecord.emailStatus === 'confirmed') {
            throw { emailAlreadyVerified: { message: 'This email is already verified.' } };
        }

        // Generate a new token
        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');

        // Update user record with new token and extended expiry (another 24 hrs)
        await User.updateOne({ id: userRecord.id })
            .set({
                emailProofToken: token,
                emailProofTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
            });

        const confirmUrl = `${sails.config.custom.baseUrl}/verify-email?token=${token}`;

        // Use the new sendEmail helper
        await sails.helpers.sendEmail.with({
            to: email,
            subject: 'Please confirm your account',
            text: `Welcome! Please click the following link to confirm your account: ${confirmUrl}`,
            html: `<p>Welcome!</p><p>Please click the link below to confirm your account:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`
        });

        return {
            message: 'Verification email has been resent successfully. Please check your inbox.'
        };
    }

};
