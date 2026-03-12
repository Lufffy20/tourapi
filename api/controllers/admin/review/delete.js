module.exports = {
    friendlyName: 'Delete Review',
    description: 'Delete a review by ID.',
    inputs: {
        id: { type: 'number', required: true }
    },
    exits: {
        success: { description: 'Review deleted.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const deleted = await TourReview.destroyOne({ id: inputs.id });
            if (!deleted) { throw 'notFound'; }

            // RE-CALCULATE TOUR STATS
            const tourId = deleted.tour;
            const allTopReviews = await TourReview.find({
                tour: tourId,
                parent: null
            });

            const totalReviews = allTopReviews.length;
            let tourAverageRating = 0;
            if (totalReviews > 0) {
                const sumOverall = allTopReviews.reduce((sum, rev) => sum + rev.overall_rating, 0);
                tourAverageRating = Math.round((sumOverall / totalReviews) * 10) / 10;
            }

            await Tour.updateOne({ id: tourId })
                .set({
                    rating: tourAverageRating,
                    reviews_count: totalReviews
                });

            return { success: true };
        } catch (err) {
            if (err === 'notFound') { throw 'notFound'; }
            sails.log.error(err);
            throw 'error';
        }
    }
};
