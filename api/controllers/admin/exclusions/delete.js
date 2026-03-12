module.exports = {
    friendlyName: 'Delete Exclusion',
    description: 'Remove an item from tour exclusions.',
    inputs: {
        id: { type: 'number', required: true }
    },
    exits: {
        success: { description: 'Exclusion deleted.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const deleted = await TourExclusion.destroyOne({ id: inputs.id });
            if (!deleted) { throw 'notFound'; }
            return { success: true, message: 'Deleted successfully' };
        } catch (err) {
            if (err === 'notFound') { throw 'notFound'; }
            sails.log.error(err);
            throw 'error';
        }
    }
};
