module.exports = {
    friendlyName: 'Create Inclusion',
    description: 'Add an item to the tour inclusions.',
    inputs: {
        tourId: { type: 'number', required: true },
        item: { type: 'string', required: true }
    },
    exits: {
        success: { description: 'Inclusion added.' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const newInclusion = await TourInclusion.create({
                tour: inputs.tourId,
                item: inputs.item
            }).fetch();
            return { success: true, data: newInclusion };
        } catch (err) {
            sails.log.error(err);
            throw 'error';
        }
    }
};
