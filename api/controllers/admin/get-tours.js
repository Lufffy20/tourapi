module.exports = {
    friendlyName: 'Get Admin Tours',
    description: 'Fetch all tours for the admin panel without advanced frontend filtering. Supports basic pagination.',

    inputs: {
        page: {
            type: 'number',
            description: 'The page number to fetch',
            defaultsTo: 1
        },
        limit: {
            type: 'number',
            description: 'The number of tours per page',
            defaultsTo: 5
        }
    },

    exits: {
        success: {
            description: 'Successfully fetched tours for admin.'
        },
        error: {
            description: 'Server error occurred.',
            responseType: 'serverError'
        }
    },

    fn: async function (inputs) {
        try {
            const page = inputs.page;
            const limit = inputs.limit;
            const skip = (page - 1) * limit;

            // Fetch tours with all nested associations populated
            const tours = await Tour.find({
                skip: skip,
                limit: limit,
                sort: 'id DESC'
            })
                .populate('faqs')
                .populate('itineraries')
                .populate('inclusions')
                .populate('exclusions')
                .populate('images')
                .populate('reviews');

            // Normalize 'images' to 'gallery' for frontend consistency
            const normalizedTours = tours.map(tour => ({
                ...tour,
                gallery: tour.images || []
            }));

            const total = await Tour.count();

            return {
                success: true,
                message: 'Tours fetched successfully for admin.',
                data: normalizedTours,
                total: total,
                page: page,
                limit: limit
            };

        } catch (err) {
            sails.log.error('Error in getting admin tours:', err);
            throw { error: { message: 'Failed to fetch admin tours.', error: err.message } };
        }
    }
};

