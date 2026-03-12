module.exports = {
    friendlyName: 'Destroy Tour',
    description: 'Delete a tour from the database.',

    inputs: {
        id: { type: 'string', required: true, description: 'ID of the tour to delete' }
    },

    exits: {
        success: { description: 'Tour deleted successfully.' },
        notFound: { description: 'No tour found with the specified ID.', responseType: 'notFound' },
        error: { description: 'Something went wrong.', responseType: 'serverError' }
    },

    fn: async function (inputs) {
        const path = require('path');
        const fs = require('fs');

        try {
            // Find the tour first to get the image path
            const tour = await Tour.findOne({ id: inputs.id });

            if (!tour) {
                throw 'notFound';
            }

            // If an image exists and it's a local file in our uploads directory, delete it
            if (tour.image && tour.image.startsWith('/uploads/tours/')) {
                const relativePath = tour.image.startsWith('/') ? tour.image.substring(1) : tour.image;
                const imagePath = path.resolve(sails.config.appPath, relativePath);

                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        sails.log.debug('Deleted image from uploads:', imagePath);
                    }
                } catch (err) {
                    sails.log.error('Error deleting image file:', err);
                    // We continue even if file deletion fails to ensure record is removed
                }
            }

            const deletedTour = await Tour.destroyOne({ id: inputs.id });

            return {
                success: true,
                message: 'Tour and associated image deleted successfully.',
                data: deletedTour
            };

        } catch (err) {
            if (err === 'notFound') throw 'notFound';
            sails.log.error('Error deleting tour:', err);
            throw { error: { message: 'Something went wrong while deleting the tour.', error: err.message || err } };
        }
    }
};

