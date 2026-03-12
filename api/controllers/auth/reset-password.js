module.exports = {

    friendlyName: 'Reset password',

    description: 'Reset a user\'s password using a recovery token.',

    inputs: {
        token: {
            description: 'The password recovery token.',
            example: '4f9c3601-d2bf-408a-9f93-875f2f534127',
            type: 'string',
            required: true
        },
        password: {
            description: 'The new, unencrypted password.',
            example: 'my_new_password_123',
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
            description: 'Password successfully updated.'
        },
        invalidOrExpiredToken: {
            responseType: 'badRequest',
            description: 'The provided token is invalid, expired, or has already been used.'
        }
    },

    fn: async function ({ token, password }) {

        // Find the user with this token
        var userRecord = await User.findOne({ passwordResetToken: token });

        // If no such user exists, or their token is expired, bail.
        if (!userRecord || userRecord.passwordResetTokenExpiresAt <= Date.now()) {
            throw { invalidOrExpiredToken: { message: 'The provided token is invalid or has expired.' } };
        }

        // Update the user's password and clear the token
        await User.updateOne({ id: userRecord.id })
            .set({
                password: password, // The beforeUpdate hook in User.js will hash this automatically!
                passwordResetToken: '',
                passwordResetTokenExpiresAt: 0
            });

        return {
            message: 'Your password has been successfully reset. You can now log in.'
        };

    }

};
