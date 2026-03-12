module.exports = {
    friendlyName: 'View Itinerary',
    description: 'Fetch a single itinerary day by its ID.',
    inputs: {
        id: { type: 'string', required: true }
    },
    exits: {
        success: { responseType: 'ok' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs, exits) {
        try {
            const itinerary = await TourItinerary.findOne({ id: inputs.id });
            if (!itinerary) return exits.notFound({ message: 'Itinerary not found' });
            return exits.success(itinerary);
        } catch (err) {
            return exits.error(err);
        }
    }
};
