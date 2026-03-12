module.exports = {

    friendlyName: 'Add favorite',

    description: 'Add a tour to the user\'s favorites.',

    inputs: {
        tourId: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
            description: 'Tour added to favorites.'
        },
        alreadyExists: {
            statusCode: 200,
            description: 'Tour is already in favorites.'
        }
    },

    fn: async function (inputs) {
        try {
            // Check if already favorited
            const existing = await Favorite.findOne({
                userId: this.req.user.id,
                tourId: inputs.tourId
            });

            if (existing) {
                // Fetch tour details to return (consistent with frontend expectation)
                const tour = await Tour.findOne({ id: inputs.tourId });
                return tour;
            }

            // Create new favorite
            await Favorite.create({
                userId: this.req.user.id,
                tourId: inputs.tourId
            });

            // Fetch tour details to return
            const tour = await Tour.findOne({ id: inputs.tourId });
            return tour;

        } catch (error) {
            sails.log.error('Error adding favorite:', error);
            throw error;
        }
    }

};
