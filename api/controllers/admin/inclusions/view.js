module.exports = {
    friendlyName: 'View Inclusion',
    description: 'Fetch a single inclusion by its ID.',
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
            const inclusion = await TourInclusion.findOne({ id: inputs.id });
            if (!inclusion) return exits.notFound({ message: 'Inclusion not found' });
            return exits.success(inclusion);
        } catch (err) {
            return exits.error(err);
        }
    }
};
