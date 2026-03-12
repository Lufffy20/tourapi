module.exports = {
    friendlyName: 'Delete FAQ',
    description: 'Remove an FAQ from a tour.',
    inputs: {
        id: { type: 'number', required: true }
    },
    exits: {
        success: { description: 'FAQ deleted.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const deleted = await TourFaq.destroyOne({ id: inputs.id });
            if (!deleted) { throw 'notFound'; }
            return { success: true, message: 'Deleted successfully' };
        } catch (err) {
            if (err === 'notFound') { throw 'notFound'; }
            sails.log.error(err);
            throw 'error';
        }
    }
};
