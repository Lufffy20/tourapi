module.exports = {
    friendlyName: 'Update Inclusion',
    description: 'Update an inclusion.',
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
            const updated = await TourInclusion.updateOne({ id: inputs.id }).set({ item: inputs.item });
            if (!updated) return exits.notFound({ message: 'Inclusion not found' });
            return exits.success(updated);
        } catch (err) {
            return exits.error(err);
        }
    }
};
