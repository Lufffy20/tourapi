module.exports = {
    friendlyName: 'Submit Review',
    description: 'Public — anyone can submit a review for a tour.',
    inputs: {
        tourId: { type: 'number', required: true },
        reviewer_name: { type: 'string', required: true },
        reviewer_email: { type: 'string', required: true },
        title: { type: 'string' },
        comment: { type: 'string', required: true },
        rating_location: { type: 'number', required: true },
        rating_amenities: { type: 'number', required: true },
        rating_food: { type: 'number', required: true },
        rating_room: { type: 'number', required: true },
        rating_price: { type: 'number', required: true },
        rating_tour_operator: { type: 'number', required: true }
    },
    exits: {
        success: { description: 'Review submitted.' },
        notFound: { responseType: 'notFound' },
        badRequest: { responseType: 'badRequest' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs, exits) {
        try {
            // Verify tour exists
            const tour = await Tour.findOne({ id: inputs.tourId });
            if (!tour) { return exits.notFound(); }

            const ratings = [
                inputs.rating_location,
                inputs.rating_amenities,
                inputs.rating_food,
                inputs.rating_room,
                inputs.rating_price,
                inputs.rating_tour_operator
            ];

            const overall_rating = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;

            const newReview = await TourReview.create({
                tour: inputs.tourId,
                reviewer_name: inputs.reviewer_name,
                reviewer_email: inputs.reviewer_email,
                title: inputs.title,
                comment: inputs.comment,
                rating_location: inputs.rating_location,
                rating_amenities: inputs.rating_amenities,
                rating_food: inputs.rating_food,
                rating_room: inputs.rating_room,
                rating_price: inputs.rating_price,
                rating_tour_operator: inputs.rating_tour_operator,
                overall_rating
            }).fetch();

            // RE-CALCULATE TOUR STATS
            // Fetch all top-level reviews for this tour
            const allTopReviews = await TourReview.find({
                tour: inputs.tourId,
                parent: null
            });

            const totalReviews = allTopReviews.length;
            let tourAverageRating = 0;

            if (totalReviews > 0) {
                const sumOverall = allTopReviews.reduce((sum, rev) => sum + rev.overall_rating, 0);
                tourAverageRating = Math.round((sumOverall / totalReviews) * 10) / 10;
            }

            // Update Tour record with new stats
            await Tour.updateOne({ id: inputs.tourId })
                .set({
                    rating: tourAverageRating,
                    reviews_count: totalReviews
                });

            return exits.success({ success: true, data: newReview });
        } catch (err) {
            sails.log.error(err);
            if (err.name === 'UsageError') {
                return exits.badRequest({ success: false, message: 'All star ratings are required.' });
            }
            return exits.error({ success: false, message: 'An unexpected error occurred.' });
        }
    }
};
