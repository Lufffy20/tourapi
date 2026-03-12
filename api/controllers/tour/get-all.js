module.exports = {

    friendlyName: 'Get all tours',

    description: 'Fetch all tours from the database with filtering, sorting, and pagination.',

    inputs: {
        page: { type: 'number', defaultsTo: 1 },
        limit: { type: 'number', defaultsTo: 10 },
        sortBy: { type: 'string', defaultsTo: 'featured' },
        tourType: { type: 'string' },
        minPrice: { type: 'number' },
        maxPrice: { type: 'number' },
        minDays: { type: 'number' },
        minRating: { type: 'number' },
        languages: { type: 'string' }, // Comma separated string e.g. "English,Spanish"
        specials: { type: 'string' },     // Comma separated string e.g. "Best Price Guarantee,Free Cancellation"
        location: { type: 'string' }
    },

    exits: {
        success: { description: 'All tours fetched successfully.' },
        error: { description: 'Something went wrong.', responseType: 'serverError' }
    },

    fn: async function (inputs) {
        try {
            // 1. Build the WHERE clause for filtering
            let whereClause = {};

            if (inputs.tourType) {
                // If multiple types are sent as comma separated, handle it. Otherwise exact match.
                whereClause.tour_type = { in: inputs.tourType.split(',') };
            }

            if (inputs.location) {
                whereClause.location = { contains: inputs.location };
            }

            if (inputs.minPrice !== undefined || inputs.maxPrice !== undefined) {
                whereClause.current_price = {};
                if (inputs.minPrice !== undefined) whereClause.current_price['>='] = inputs.minPrice;
                if (inputs.maxPrice !== undefined) whereClause.current_price['<='] = inputs.maxPrice;
            }

            if (inputs.minDays !== undefined) {
                whereClause.days = { '>=': inputs.minDays };
            }

            if (inputs.minRating !== undefined) {
                whereClause.rating = { '>=': inputs.minRating };
            }

            // Note: In Waterline ORM (Sails.js), querying inside JSON columns (`tour_language`, `features`) 
            // can be complex depending on the underlying database (MySQL/PostgreSQL vs MongoDB).
            // For a basic implementation, we might need to handle this differently or if using a NoSQL DB, it works directly.
            // Assuming we can do basic 'contains' or string matching for now, OR we filter JSON fields in memory if DB doesn't support it well.
            // To keep it safe across standard SQL DBs without native JSON querying in Waterline, we'll fetch then filter, 
            // OR if you are using MongoDB, we can query directly. Let's assume standard SQL and filter JSON fields post-query for safety 
            // if complex, but for now we'll try a basic approach or omit JSON deep filtering in favor of fetching and filtering if too complex.
            // Actually, let's keep it simple: if filtering by language/specials is needed and it's stored as JSON array,
            // Waterline might struggle on standard SQL. We will fetch with basic filters and do JSON filters in JS before pagination.
            // *Optimization note*: For large datasets, this needs a proper DB structure (e.g. separate tables).

            // Let's rely on basic DB filters first
            const baseQuery = Tour.find({ where: whereClause }).populate('images');

            let allTours = await baseQuery;

            // 2. Post-fetch filtering for JSON columns or complex logic (Not ideal for 1M rows, but fine for now)
            if (inputs.languages) {
                const langArray = inputs.languages.split(',');
                allTours = allTours.filter(tour => {
                    if (!tour.tour_language) return false;
                    const tourLangs = Array.isArray(tour.tour_language) ? tour.tour_language : [tour.tour_language];
                    // Tour must have at least one of the selected languages
                    return langArray.some(lang => tourLangs.includes(lang));
                });
            }

            if (inputs.specials) {
                const specialsArray = inputs.specials.split(',');
                allTours = allTours.filter(tour => {
                    const features = tour.features || {};
                    let match = true;
                    if (specialsArray.includes("Best Price Guarantee") && !features.best_price) match = false;
                    if (specialsArray.includes("Free Cancellation") && !features.free_cancel) match = false;
                    return match;
                });
            }

            // 3. Sorting
            allTours.sort((a, b) => {
                switch (inputs.sortBy) {
                    case 'priceLowHigh': return a.current_price - b.current_price;
                    case 'priceHighLow': return b.current_price - a.current_price;
                    case 'rating': return (b.rating || 0) - (a.rating || 0);
                    case 'reviews': return (b.reviews_count || 0) - (a.reviews_count || 0);
                    case 'featured': default: return 0; // Default sorting (could be by createdAt desc or is_featured)
                }
            });

            // 4. Pagination
            const total = allTours.length;
            const skip = (inputs.page - 1) * inputs.limit;
            const paginatedTours = allTours.slice(skip, skip + inputs.limit);

            // 5. LIVE CALCULATE STATS for the paginated subset (Fallback for desync)
            const tourIds = paginatedTours.map(t => t.id);
            // Fetch ALL reviews for these tours to handle cases where parent might be undefined
            const allRelevantReviews = await TourReview.find({ tour: tourIds });
            const topLevelReviews = allRelevantReviews.filter(r => !r.parent);

            // Group top-level reviews by tourId
            const reviewsByTour = {};
            topLevelReviews.forEach(rev => {
                if (!reviewsByTour[rev.tour]) reviewsByTour[rev.tour] = [];
                reviewsByTour[rev.tour].push(rev);
            });

            // Patch each tour object
            paginatedTours.forEach(tour => {
                const tourReviews = reviewsByTour[tour.id] || [];
                const totalRev = tourReviews.length;
                let avg = 0;
                if (totalRev > 0) {
                    const sum = tourReviews.reduce((s, r) => s + r.overall_rating, 0);
                    avg = Math.round((sum / totalRev) * 10) / 10;
                }
                tour.reviews_count = totalRev;
                tour.rating = avg;
            });

            // Return { data, total }
            return {
                data: paginatedTours,
                total: total,
                page: inputs.page,
                limit: inputs.limit
            };

        } catch (err) {
            sails.log.error('Error fetching tours:', err);
            throw 'error';
        }
    }
};
