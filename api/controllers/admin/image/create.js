module.exports = {
    friendlyName: 'Upload Image',
    description: 'Upload an image and associate it with a tour.',
    inputs: {
        tourId: {
            type: 'number',
            required: true,
            description: 'The ID of the tour this image belongs to'
        }
    },
    exits: {
        success: {
            description: 'Image uploaded and record created.'
        },
        error: {
            responseType: 'serverError'
        }
    },
    fn: async function (inputs) {
        const tourId = inputs.tourId;

        // Use Skipper to upload the file
        return new Promise((resolve, reject) => {
            this.res.req.file('image').upload({
                dirname: '../../assets/images/gallery',
                maxBytes: 10000000 // 10MB
            }, async (err, uploadedFiles) => {
                if (err) {
                    return resolve(this.res.serverError(err));
                }

                if (uploadedFiles.length === 0) {
                    return resolve(this.res.badRequest('No file was uploaded'));
                }

                const fd = uploadedFiles[0].fd;
                const filename = fd.split('/').pop();
                const imageUrl = `/images/gallery/${filename}`;

                try {
                    const newImage = await TourImage.create({
                        image_url: imageUrl,
                        tour: tourId
                    }).fetch();

                    return resolve({
                        success: true,
                        data: newImage
                    });
                } catch (dbErr) {
                    sails.log.error(dbErr);
                    return resolve(this.res.serverError(dbErr));
                }
            });
        });
    }
};
