module.exports = {


    friendlyName: 'Get tour details',


    description: 'Fetch complete details for a single tour including images, itinerary, etc.',


    inputs: {
        id: {
            type: 'string',
            required: true,
            description: 'The ID of the tour to fetch'
        }
    },


    exits: {
        success: {
            description: 'Tour details fetched successfully.',
            responseType: 'ok'
        },
        notFound: {
            description: 'No tour found with the specified ID.',
            responseType: 'notFound'
        }
    },


    fn: async function (inputs) {
        try {
            const tourId = parseInt(inputs.id, 10);

            const tour = await Tour.findOne({ id: tourId })
                .populate('images')
                .populate('itineraries')
                .populate('inclusions')
                .populate('exclusions')
                .populate('faqs');

            if (!tour) {
                throw 'notFound';
            }

            // LIVE CALCULATE STATS (Fallback for desync)
            const allTopReviews = await TourReview.find({ tour: tour.id });
            const topLevelReviews = allTopReviews.filter(r => !r.parent);

            const totalReviews = topLevelReviews.length;
            let tourAverageRating = 0;
            if (totalReviews > 0) {
                const sumOverall = topLevelReviews.reduce((sum, rev) => sum + rev.overall_rating, 0);
                tourAverageRating = Math.round((sumOverall / totalReviews) * 10) / 10;
            }

            return {
                success: true,
                data: {
                    ...tour,
                    reviews_count: totalReviews,
                    rating: tourAverageRating,
                    gallery: tour.images || []
                }
            };

        } catch (error) {
            sails.log.error(error);
            if (error === 'notFound') { throw 'notFound'; }
            return this.res.serverError({ success: false, message: 'Server error fetching tour details' });
        }
    }


};
