module.exports = {
    friendlyName: 'Delete Itinerary',
    description: 'Remove a day from a tour itinerary.',
    inputs: {
        id: { type: 'number', required: true }
    },
    exits: {
        success: { description: 'Itinerary deleted.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const deleted = await TourItinerary.destroyOne({ id: inputs.id });
            if (!deleted) { throw 'notFound'; }
            return { success: true, message: 'Deleted successfully' };
        } catch (err) {
            if (err === 'notFound') { throw 'notFound'; }
            sails.log.error(err);
            throw 'error';
        }
    }
};
