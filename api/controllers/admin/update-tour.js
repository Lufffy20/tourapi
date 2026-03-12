module.exports = {
    friendlyName: 'Update Tour',
    description: 'Update an existing tour.',

    inputs: {
        id: { type: 'string', required: true },
        title: { type: 'string' },
        location: { type: 'string' },
        tour_type: { type: 'string' },
        description: { type: 'string' },
        days: { type: 'number' },
        nights: { type: 'number' },
        group_size: { type: 'string' },
        ages: { type: 'string' },
        current_price: { type: 'number' },
        old_price: { type: 'number' },
        rating: { type: 'number' },
        badge_text: { type: 'string' },
        reviews_count: { type: 'number' },
        tour_language: { type: 'json' },
        features: { type: 'json' }
    },

    exits: {
        success: { description: 'Tour updated successfully.' },
        notFound: { description: 'Tour not found.', responseType: 'notFound' },
        badRequest: { description: 'Bad Request', responseType: 'badRequest' },
        error: { description: 'Server Error', responseType: 'serverError' }
    },

    fn: async function (inputs) {
        const path = require('path');
        const fs = require('fs');

        let uploadedFiles = [];
        try {
            // 1. Upload
            const uploadImage = () => {
                const uploadPath = path.resolve(sails.config.appPath, 'uploads/tours');
                return new Promise((resolve, reject) => {
                    this.req.file('image').upload({
                        dirname: uploadPath,
                        maxBytes: 10000000
                    }, (err, files) => {
                        if (err) return reject(err);
                        resolve(files);
                    });
                });
            };

            uploadedFiles = await uploadImage();

            // 2. Data Construction
            const { id, ...updateData } = inputs;
            const updateDataFinal = { ...updateData };

            if (uploadedFiles.length > 0) {
                const filename = path.basename(uploadedFiles[0].fd);
                updateDataFinal.image = `/uploads/tours/${filename}`;
            }

            // Handle JSON parsing if sent as strings (e.g. from multipart/form-data)
            if (typeof updateDataFinal.tour_language === 'string') {
                try { updateDataFinal.tour_language = JSON.parse(updateDataFinal.tour_language); } catch (e) { }
            }
            if (typeof updateDataFinal.features === 'string') {
                try { updateDataFinal.features = JSON.parse(updateDataFinal.features); } catch (e) { }
            }

            sails.log.debug('Final Update Payload:', updateDataFinal);

            const updatedTour = await Tour.updateOne({ id }).set(updateDataFinal);

            if (!updatedTour) {
                if (uploadedFiles.length > 0) {
                    try { fs.unlinkSync(uploadedFiles[0].fd); } catch (e) { }
                }
                throw 'notFound';
            }

            return {
                success: true,
                message: 'Tour updated successfully.',
                data: updatedTour
            };

        } catch (err) {
            if (err === 'notFound') throw 'notFound';
            if (uploadedFiles.length > 0) {
                try { fs.unlinkSync(uploadedFiles[0].fd); } catch (e) { }
            }
            sails.log.error('Error updating tour:', err);
            throw { error: { message: 'Server Error', error: err.message } };
        }
    }
};

