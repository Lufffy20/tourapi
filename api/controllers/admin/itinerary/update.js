module.exports = {
    friendlyName: 'Update Itinerary',
    description: 'Update an existing day in a tour itinerary.',
    inputs: {
        id: { type: 'number', required: true, description: 'The ID of the itinerary record' },
        day_number: { type: 'number' },
        title: { type: 'string' },
        description: { type: 'string' },
        time: { type: 'string' }
    },
    exits: {
        success: { description: 'Itinerary updated.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const updated = await TourItinerary.updateOne({ id: inputs.id }).set({
                day_number: inputs.day_number,
                title: inputs.title,
                description: inputs.description,
                time: inputs.time
            });
            if (!updated) { throw 'notFound'; }
            return { success: true, data: updated };
        } catch (err) {
            if (err === 'notFound') { throw 'notFound'; }
            sails.log.error(err);
            throw 'error';
        }
    }
};
