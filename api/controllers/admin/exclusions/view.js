module.exports = {
    friendlyName: 'View Exclusion',
    description: 'Fetch a single exclusion by its ID.',
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
            const exclusion = await TourExclusion.findOne({ id: inputs.id });
            if (!exclusion) return exits.notFound({ message: 'Exclusion not found' });
            return exits.success(exclusion);
        } catch (err) {
            return exits.error(err);
        }
    }
};
