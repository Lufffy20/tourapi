module.exports = {
    friendlyName: 'Update Review',
    description: 'Update an existing review.',
    inputs: {
        id: { type: 'number', required: true },
        reviewer_name: { type: 'string' },
        reviewer_email: { type: 'string' },
        title: { type: 'string' },
        comment: { type: 'string' },
        rating_location: { type: 'number' },
        rating_amenities: { type: 'number' },
        rating_food: { type: 'number' },
        rating_room: { type: 'number' },
        rating_price: { type: 'number' },
        rating_tour_operator: { type: 'number' }
    },
    exits: {
        success: { description: 'Review updated.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs) {
        try {
            const existing = await TourReview.findOne({ id: inputs.id });
            if (!existing) { throw 'notFound'; }

            const ratings = [
                inputs.rating_location ?? existing.rating_location,
                inputs.rating_amenities ?? existing.rating_amenities,
                inputs.rating_food ?? existing.rating_food,
                inputs.rating_room ?? existing.rating_room,
                inputs.rating_price ?? existing.rating_price,
                inputs.rating_tour_operator ?? existing.rating_tour_operator
            ].filter(r => r !== undefined && r !== null);

            const overall_rating = ratings.length > 0
                ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
                : existing.overall_rating;

            const updateData = { overall_rating };
            if (inputs.reviewer_name !== undefined) updateData.reviewer_name = inputs.reviewer_name;
            if (inputs.reviewer_email !== undefined) updateData.reviewer_email = inputs.reviewer_email;
            if (inputs.title !== undefined) updateData.title = inputs.title;
            if (inputs.comment !== undefined) updateData.comment = inputs.comment;
            if (inputs.rating_location !== undefined) updateData.rating_location = inputs.rating_location;
            if (inputs.rating_amenities !== undefined) updateData.rating_amenities = inputs.rating_amenities;
            if (inputs.rating_food !== undefined) updateData.rating_food = inputs.rating_food;
            if (inputs.rating_room !== undefined) updateData.rating_room = inputs.rating_room;
            if (inputs.rating_price !== undefined) updateData.rating_price = inputs.rating_price;
            if (inputs.rating_tour_operator !== undefined) updateData.rating_tour_operator = inputs.rating_tour_operator;

            const updated = await TourReview.updateOne({ id: inputs.id }).set(updateData);
            if (!updated) { throw 'notFound'; }

            // RE-CALCULATE TOUR STATS
            const tourId = existing.tour;
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

            return { success: true, data: updated };
        } catch (err) {
            if (err === 'notFound') { throw 'notFound'; }
            sails.log.error(err);
            throw 'error';
        }
    }
};
