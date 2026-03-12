module.exports = {
    friendlyName: 'View Review',
    description: 'Fetch a single review by ID.',
    inputs: {
        id: { type: 'number', required: true }
    },
    exits: {
        success: { description: 'Review found.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const review = await TourReview.findOne({ id: inputs.id }).populate('tour');
            if (!review) { throw 'notFound'; }
            return { success: true, data: review };
        } catch (err) {
            if (err === 'notFound') { throw 'notFound'; }
            sails.log.error(err);
            throw 'error';
        }
    }
};
