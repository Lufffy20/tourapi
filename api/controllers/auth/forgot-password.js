module.exports = {

    friendlyName: 'Forgot password',

    description: 'Send a password recovery notification to the user with a reset link.',

    inputs: {
        email: {
            description: 'The email address of the user who wants to recover their password.',
            example: 'albus@dumbledore.com',
            type: 'string',
            isEmail: true,
            required: true
        }
    },

    exits: {
        success: {
            description: 'The email address was found and a recovery email was sent.'
        },
        userNotFound: {
            statusCode: 404,
            description: 'Handling cases where no user matches the email gracefully is recommended for security.'
        }
    },

    fn: async function ({ email }) {

        // Find the record for this user.
        var userRecord = await User.findOne({ email: email.toLowerCase() });

        // If there was no matching user, we just return generic success for security reasons,
        // so attackers can't "fish" for valid email addresses. (Or optionally return 404)
        if (!userRecord) {
            return { message: 'If that email address is in our database, we will send a password recovery email to it.' };
        }

        // Generate a new token
        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');

        // Update the record with password reset token
        await User.updateOne({ id: userRecord.id })
            .set({
                passwordResetToken: token,
                passwordResetTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000  // expires in 24 hours
            });

        // Use the frontend URL from config
        const resetUrl = `${sails.config.custom.frontendUrl}/reset-password?token=${token}`;

        // Use the new sendEmail helper
        await sails.helpers.sendEmail.with({
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
            html: `<p>You requested a password reset. Click the link below to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can safely ignore this email.</p>`
        });

        return {
            message: 'If that email address is in our database, we will send a password recovery email to it.'
        };
    }

};
