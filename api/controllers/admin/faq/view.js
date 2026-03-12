/**
 * admin/faq/view.js
 *
 * @description :: Fetch a single FAQ by ID
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

module.exports = {

    friendlyName: 'View FAQ',

    description: 'Fetch a single FAQ by its ID.',

    inputs: {
        id: {
            description: 'The ID of the FAQ to look up.',
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
            description: 'The FAQ was found and returned successfully.',
            responseType: 'ok'
        },
        notFound: {
            description: 'The FAQ with the specified ID was not found.',
            responseType: 'notFound'
        },
        error: {
            description: 'An error occurred while fetching the FAQ.',
            responseType: 'serverError'
        }
    },

    fn: async function (inputs, exits) {
        try {
            const faq = await TourFaq.findOne({ id: inputs.id });

            if (!faq) {
                return exits.notFound({ message: 'FAQ not found' });
            }

            return exits.success(faq);
        } catch (err) {
            sails.log.error('Error in admin/faq/view:', err);
            return exits.error(err);
        }
    }

};
