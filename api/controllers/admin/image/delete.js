module.exports = {
    friendlyName: 'Delete Image',
    description: 'Delete a gallery image by ID.',
    inputs: {
        id: {
            type: 'number',
            required: true,
            description: 'The ID of the image to delete'
        }
    },
    exits: {
        success: {
            description: 'Image deleted successfully.'
        },
        notFound: {
            responseType: 'notFound'
        },
        error: {
            responseType: 'serverError'
        }
    },
    fn: async function (inputs) {
        try {
            const image = await TourImage.findOne({ id: inputs.id });
            if (!image) {
                throw 'notFound';
            }

            await TourImage.destroy({ id: inputs.id });

            return { success: true };
        } catch (err) {
            if (err === 'notFound') throw err;
            sails.log.error(err);
            throw 'error';
        }
    }
};
