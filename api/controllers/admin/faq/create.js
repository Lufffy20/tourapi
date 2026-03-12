module.exports = {
    friendlyName: 'Create FAQ',
    description: 'Add a new FAQ to a tour.',
    inputs: {
        tourId: { type: 'number', required: true },
        question: { type: 'string', required: true },
        answer: { type: 'string', required: true }
    },
    exits: {
        success: { description: 'FAQ created.' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const newFaq = await TourFaq.create({
                tour: inputs.tourId,
                question: inputs.question,
                answer: inputs.answer
            }).fetch();
            return { success: true, data: newFaq };
        } catch (err) {
            sails.log.error(err);
            throw 'error';
        }
    }
};
