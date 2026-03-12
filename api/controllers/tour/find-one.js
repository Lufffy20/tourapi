module.exports = {
    friendlyName: 'Find one tour',
    description: 'Look up a specific tour by its ID.',

    inputs: {
        id: { type: 'string', required: true, description: 'The ID of the tour to look up.' }
    },

    exits: {
        success: { description: 'Tour found successfully.' },
        notFound: { description: 'No tour found with the specified ID.', responseType: 'notFound' },
        error: { description: 'Something went wrong.', responseType: 'serverError' }
    },

    fn: async function (inputs) {
        try {
            const tour = await Tour.findOne({ id: inputs.id }).populate('images');
            if (!tour) { throw 'notFound'; }

            return tour;
        } catch (err) {
            if (err === 'notFound') throw err;
            sails.log.error('Error finding tour:', err);
            throw 'error';
        }
    }
};
