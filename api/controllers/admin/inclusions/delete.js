module.exports = {
    friendlyName: 'Delete Inclusion',
    description: 'Remove an item from tour inclusions.',
    inputs: {
        id: { type: 'number', required: true }
    },
    exits: {
        success: { description: 'Inclusion deleted.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const deleted = await TourInclusion.destroyOne({ id: inputs.id });
            if (!deleted) { throw 'notFound'; }
            return { success: true, message: 'Deleted successfully' };
        } catch (err) {
            if (err === 'notFound') { throw 'notFound'; }
            sails.log.error(err);
            throw 'error';
        }
    }
};
