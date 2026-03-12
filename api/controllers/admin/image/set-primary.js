module.exports = {
    friendlyName: 'Set primary image',
    description: 'Mark a specific image as the primary photo for its tour.',

    inputs: {
        id: {
            type: 'string',
            required: true,
            description: 'The ID of the image to set as primary.'
        }
    },

    exits: {
        success: {
            description: 'Image set as primary successfully.'
        },
        notFound: {
            responseType: 'notFound',
            description: 'Image not found.'
        },
        error: {
            responseType: 'serverError',
            description: 'An error occurred while setting the primary image.'
        }
    },

    fn: async function (inputs, exits) {
        try {
            // 1. Find the image and its tour ID
            const image = await TourImage.findOne({ id: inputs.id });
            if (!image) {
                return exits.notFound({ message: 'Image not found' });
            }

            // 2. Wrap in a transaction to unset current primary and set new one
            await sails.getDatastore().transaction(async (db) => {
                // Unset any existing primary for this tour
                await TourImage.update({ tour: image.tour, is_primary: true })
                    .set({ is_primary: false })
                    .usingConnection(db);

                // Set the new primary
                await TourImage.updateOne({ id: inputs.id })
                    .set({ is_primary: true })
                    .usingConnection(db);
            });

            return exits.success({ message: 'Primary image updated successfully' });
        } catch (err) {
            sails.log.error('Error setting primary image:', err);
            return exits.error(err);
        }
    }
};
