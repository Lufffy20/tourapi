module.exports = {

    friendlyName: 'Login',

    description: 'Log in using the provided email and password combination.',

    inputs: {
        email: {
            description: 'The email to try in this attempt.',
            type: 'string',
            required: true
        },
        password: {
            description: 'The unencrypted password to try in this attempt.',
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
            description: 'The requesting user agent has been successfully logged in.'
        },
        badCombo: {
            description: 'The provided email and password combination does not match any user in the database.',
            responseType: 'badRequest'
            // ^This uses the custom `unauthorized` response. If you don't have one, just use `badRequest` and HTTP 400.
        },
        emailNotVerified: {
            description: 'The user has not verified their email address.',
            responseType: 'badRequest'
        }
    },

    fn: async function ({ email, password }) {

        // Find the user by email
        const userRecord = await User.findOne({
            email: email.toLowerCase()
        });

        // If there was no matching user, sign in failed.
        if (!userRecord) {
            throw { badCombo: { message: 'The provided email and password combination does not match any user in the database.' } };
        }

        // Check password
        const bcrypt = require('bcrypt');
        const isMatched = await bcrypt.compare(password, userRecord.password);

        if (!isMatched) {
            throw { badCombo: { message: 'The provided email and password combination does not match any user in the database.' } };
        }

        // Check if email is verified
        if (userRecord.emailStatus !== 'confirmed') {
            throw { emailNotVerified: { message: 'Please verify your email address before logging in.' } };
        }

        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: userRecord.id, email: userRecord.email, role: userRecord.role },
            sails.config.custom.jwtSecret,
            { expiresIn: '1d' }
        );

        return {
            message: 'Logged in successfully',
            token,
            user: {
                id: userRecord.id,
                firstName: userRecord.firstName,
                lastName: userRecord.lastName,
                email: userRecord.email,
                role: userRecord.role
            }
        };
    }

};
