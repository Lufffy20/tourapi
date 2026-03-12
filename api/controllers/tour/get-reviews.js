module.exports = {
    friendlyName: 'Get Tour Reviews',
    description: 'Public — fetch all reviews for a specific tour.',
    inputs: {
        tourId: { type: 'number', required: true }
    },
    exits: {
        success: { description: 'Reviews fetched.' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs, exits) {
        try {
            // Fetch ALL reviews for this tour (top-level and replies)
            const allReviews = await TourReview.find({
                tour: inputs.tourId
            }).sort('createdAt DESC');

            // 1. Build a map of all reviews by ID for quick access
            const reviewMap = {};
            allReviews.forEach(r => {
                reviewMap[r.id] = { ...r, replies: [] };
            });

            // 2. Separate top-level reviews and wire up replies recursively
            const topLevelReviews = [];
            allReviews.forEach(r => {
                if (!r.parent) {
                    topLevelReviews.push(reviewMap[r.id]);
                } else if (reviewMap[r.parent]) {
                    // Push into the map entry to preserve nesting
                    reviewMap[r.parent].replies.push(reviewMap[r.id]);
                }
            });

            // Note: Since allReviews is sorted by DESC, we might want to sort replies within each node
            // to ensure they appear in the correct order (e.g. oldest first for replies)
            const sortReplies = (node) => {
                if (node.replies && node.replies.length > 0) {
                    node.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    node.replies.forEach(sortReplies);
                }
            };
            topLevelReviews.forEach(sortReplies);

            // Compute averages only from top-level reviews (which have ratings)
            const ratingFields = [
                'rating_location', 'rating_amenities', 'rating_food',
                'rating_room', 'rating_price', 'rating_tour_operator'
            ];

            const averages = {};
            ratingFields.forEach(field => {
                const values = topLevelReviews.map(r => r[field]).filter(v => v !== null && v !== undefined);
                averages[field] = values.length > 0
                    ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
                    : 0;
            });

            const allOverall = topLevelReviews.map(r => r.overall_rating).filter(v => v !== null && v !== undefined);
            const overall_average = allOverall.length > 0
                ? Math.round((allOverall.reduce((a, b) => a + b, 0) / allOverall.length) * 10) / 10
                : 0;

            return exits.success({
                success: true,
                data: topLevelReviews,
                averages: { ...averages, overall: overall_average },
                total: topLevelReviews.length
            });
        } catch (err) {
            sails.log.error('Error in get-reviews:', err);
            return exits.error({ success: false, message: 'Failed to fetch reviews' });
        }
    }
};
