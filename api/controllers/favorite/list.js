module.exports = {

    friendlyName: 'List favorites',

    description: 'List all favorite tours for the authenticated user.',

    exits: {
        success: {
            description: 'List of favorites with tour details.'
        }
    },

    fn: async function () {
        try {
            // Find all favorites for this user
            const favorites = await Favorite.find({
                userId: this.req.user.id
            });

            const tourIds = favorites.map(f => f.tourId);

            // Fetch the actual tours with images populated
            const tours = await Tour.find({
                id: tourIds
            }).populate('images');

            // LIVE CALCULATE STATS (to match get-all.js behavior)
            const allRelevantReviews = await TourReview.find({ tour: tourIds, parent: null });
            const reviewsByTour = {};
            allRelevantReviews.forEach(rev => {
                if (!reviewsByTour[rev.tour]) reviewsByTour[rev.tour] = [];
                reviewsByTour[rev.tour].push(rev);
            });

            const patchedTours = tours.map(tour => {
                const tourReviews = reviewsByTour[tour.id] || [];
                const totalRev = tourReviews.length;
                let avg = 0;
                if (totalRev > 0) {
                    const sum = tourReviews.reduce((s, r) => s + r.overall_rating, 0);
                    avg = Math.round((sum / totalRev) * 10) / 10;
                }
                return {
                    ...tour,
                    reviews_count: totalRev,
                    rating: avg
                };
            });

            return patchedTours;

        } catch (error) {
            sails.log.error('Error fetching favorites:', error);
            throw error;
        }
    }

};
