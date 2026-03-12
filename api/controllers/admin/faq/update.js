module.exports = {
    friendlyName: 'Update FAQ',
    description: 'Update an existing FAQ.',
    inputs: {
        id: { type: 'number', required: true },
        question: { type: 'string' },
        answer: { type: 'string' }
    },
    exits: {
        success: { description: 'FAQ updated.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const updated = await TourFaq.updateOne({ id: inputs.id }).set({
                question: inputs.question,
                answer: inputs.answer
            });
            if (!updated) { throw 'notFound'; }
            return { success: true, data: updated };
        } catch (err) {
            if (err === 'notFound') { throw 'notFound'; }
            sails.log.error(err);
            throw 'error';
        }
    }
};
