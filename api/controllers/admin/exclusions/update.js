module.exports = {
    friendlyName: 'Update Exclusion',
    description: 'Update an exclusion.',
    inputs: {
        id: { type: 'string', required: true },
        item: { type: 'string' }
    },
    exits: {
        success: { responseType: 'ok' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs, exits) {
        try {
            const updated = await TourExclusion.updateOne({ id: inputs.id }).set({ item: inputs.item });
            if (!updated) return exits.notFound({ message: 'Exclusion not found' });
            return exits.success(updated);
        } catch (err) {
            return exits.error(err);
        }
    }
};
