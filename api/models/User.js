/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        firstName: {
            type: 'string',
            required: true,
            columnName: 'first_name',
        },

        lastName: {
            type: 'string',
            required: true,
            columnName: 'last_name',
        },

        phoneNumber: {
            type: 'string',
            required: true,
            columnName: 'phone_number',
        },

        email: {
            type: 'string',
            required: true,
            unique: true,
            isEmail: true,
        },

        password: {
            type: 'string',
            required: true,
            protect: true,
        },

        termsAndConditions: {
            type: 'boolean',
            defaultsTo: false,
            columnName: 'terms_and_conditions',
        },

        emailProofToken: {
            type: 'string',
            description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.',
            columnName: 'email_proof_token'
        },

        emailProofTokenExpiresAt: {
            type: 'number',
            description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `emailProofToken` will expire (or 0 if the user currently has no such token).',
            example: 1502844074211,
            columnName: 'email_proof_token_expires_at'
        },

        emailStatus: {
            type: 'string',
            isIn: ['unconfirmed', 'change-requested', 'confirmed'],
            defaultsTo: 'unconfirmed',
            description: 'The confirmation status of the user\'s email address.',
            columnName: 'email_status'
        },

        role: {
            type: 'number',
            defaultsTo: 0,
            description: '0 = user, 1 = admin',
            columnName: 'role'
        },

        passwordResetToken: {
            type: 'string',
            description: 'A pseudorandom, probabilistically-unique token for use in password reset emails.',
            columnName: 'password_reset_token'
        },

        passwordResetTokenExpiresAt: {
            type: 'number',
            description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `passwordResetToken` will expire.',
            columnName: 'password_reset_token_expires_at'
        },

        stripeCustomerId: {
            type: 'string',
            description: 'The ID of the corresponding Stripe customer.',
            columnName: 'stripe_customer_id'
        }

    },

    // Lifecycle callback (hook) to hash the password before saving
    beforeCreate: async function (valuesToSet, proceed) {
        const bcrypt = require('bcrypt');
        // Hash the password if it's being set
        if (valuesToSet.password) {
            valuesToSet.password = await bcrypt.hash(valuesToSet.password, 10);
        }
        return proceed();
    },

    beforeUpdate: async function (valuesToSet, proceed) {
        const bcrypt = require('bcrypt');
        // Hash the password if it's being updated
        if (valuesToSet.password) {
            valuesToSet.password = await bcrypt.hash(valuesToSet.password, 10);
        }
        return proceed();
    }

};
