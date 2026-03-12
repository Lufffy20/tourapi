module.exports = {

    friendlyName: 'Remove favorite',

    description: 'Remove a tour from the user\'s favorites.',

    inputs: {
        tourId: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
            description: 'Tour removed from favorites.'
        }
    },

    fn: async function (inputs) {
        try {
            await Favorite.destroy({
                userId: this.req.user.id,
                tourId: inputs.tourId
            });

            return { success: true };

        } catch (error) {
            sails.log.error('Error removing favorite:', error);
            throw error;
        }
    }

};
