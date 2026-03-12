module.exports = {
    friendlyName: 'Create Exclusion',
    description: 'Add an item to the tour exclusions.',
    inputs: {
        tourId: { type: 'number', required: true },
        item: { type: 'string', required: true }
    },
    exits: {
        success: { description: 'Exclusion added.' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const newExclusion = await TourExclusion.create({
                tour: inputs.tourId,
                item: inputs.item
            }).fetch();
            return { success: true, data: newExclusion };
        } catch (err) {
            sails.log.error(err);
            throw 'error';
        }
    }
};
