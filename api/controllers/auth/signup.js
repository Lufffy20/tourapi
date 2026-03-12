module.exports = {

    friendlyName: 'Signup',

    description: 'Register a new user account.',

    inputs: {
        firstName: {
            type: 'string',
            required: true,
            description: 'The user\'s first name.'
        },
        lastName: {
            type: 'string',
            required: true,
            description: 'The user\'s last name.'
        },
        phoneNumber: {
            type: 'string',
            required: true,
            description: 'The user\'s phone number.'
        },
        email: {
            type: 'string',
            required: true,
            isEmail: true,
            description: 'The email address for the new account, e.g. m@example.com.'
        },
        password: {
            type: 'string',
            required: true,
            minLength: 6,
            description: 'Unencrypted password to use for the new account.'
        },
        termsAndConditions: {
            type: 'boolean',
            required: true,
            description: 'Whether the user agreed to the terms and conditions.'
        }
    },

    exits: {
        success: {
            statusCode: 201,
            description: 'New user account was created successfully.'
        },
        emailAlreadyInUse: {
            statusCode: 409,
            description: 'The provided email address is already in use.',
            responseType: 'badRequest'
        },
        termsNotAccepted: {
            statusCode: 400,
            description: 'User must accept terms and conditions.'
        }
    },

    fn: async function (inputs) {
        if (!inputs.termsAndConditions) {
            throw 'termsNotAccepted';
        }

        const email = inputs.email.toLowerCase();

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            throw { emailAlreadyInUse: { message: 'Email address is already registered.' } };
        }

        // Generate a token for email verification
        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');

        await User.create({
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            phoneNumber: inputs.phoneNumber,
            email,
            password: inputs.password,
            termsAndConditions: inputs.termsAndConditions,
            emailProofToken: token,
            emailProofTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
            emailStatus: 'unconfirmed'
        });

        const confirmUrl = `${sails.config.custom.baseUrl}/api/v1/auth/verify-email?token=${token}`;

        // Use the new sendEmail helper
        await sails.helpers.sendEmail.with({
            to: email,
            subject: 'Please confirm your account',
            text: `Welcome! Please click the following link to confirm your account: ${confirmUrl}`,
            html: `<p>Welcome!</p><p>Please click the link below to confirm your account:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`
        });

        return {
            message: 'Account created successfully. Please check your email to verify your account.'
        };
    }

};
