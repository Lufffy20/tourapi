module.exports = {
    friendlyName: 'Create Itinerary',
    description: 'Add a new day to a tour itinerary.',
    inputs: {
        tourId: { type: 'number', required: true, description: 'The ID of the tour' },
        day_number: { type: 'number', required: true },
        title: { type: 'string', required: true },
        description: { type: 'string' },
        time: { type: 'string' }
    },
    exits: {
        success: { description: 'Itinerary created.' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const newItinerary = await TourItinerary.create({
                tour: inputs.tourId,
                day_number: inputs.day_number,
                title: inputs.title,
                description: inputs.description,
                time: inputs.time
            }).fetch();
            return { success: true, data: newItinerary };
        } catch (err) {
            sails.log.error(err);
            throw 'error';
        }
    }
};
