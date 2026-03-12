const stripe = require('stripe')(sails.config.custom.stripeSecretKey);

module.exports = {

    friendlyName: 'Stripe',

    description: 'Stripe helper for customer management.',

    inputs: {
        email: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
            description: 'Stripe customer created successfully.',
        },
        error: {
            description: 'An error occurred while creating the Stripe customer.',
        }
    },

    fn: async function (inputs) {
        try {
            const customer = await stripe.customers.create({
                email: inputs.email,
                name: inputs.name,
            });

            return customer.id;
        } catch (error) {
            sails.log.error('Stripe customer creation failed:', error);
            throw 'error';
        }
    }

};
