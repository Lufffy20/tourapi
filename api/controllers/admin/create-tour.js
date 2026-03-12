module.exports = {
    friendlyName: 'Create Tour',
    description: 'Create a new tour.',

    inputs: {
        title: { type: 'string', required: true },
        location: { type: 'string', required: true },
        tour_type: { type: 'string' },
        description: { type: 'string' },
        days: { type: 'number' },
        nights: { type: 'number' },
        group_size: { type: 'string' },
        ages: { type: 'string' },
        current_price: { type: 'number', required: true },
        old_price: { type: 'number' },
        rating: { type: 'number' },
        badge_text: { type: 'string' },
        reviews_count: { type: 'number' },
        tour_language: { type: 'json' },
        features: { type: 'json' },

        // Nested Data (JSON Arrays)
        itineraries: { type: 'json' },
        faqs: { type: 'json' },
        gallery: { type: 'json' },
        inclusions: { type: 'json' },
        exclusions: { type: 'json' }
    },

    exits: {
        success: { description: 'New tour created successfully.' },
        badRequest: { description: 'Invalid input data.', responseType: 'badRequest' },
        error: { description: 'Something went wrong.', responseType: 'serverError' }
    },

    fn: async function (inputs, exits) {
        const path = require('path');
        const fs = require('fs');
        let uploadedFiles = [];
        try {
            // 1. Upload all images from the 'images' field
            const allImages = await new Promise((resolve, reject) => {
                this.req.file('images').upload({
                    dirname: path.resolve(sails.config.appPath, 'uploads/gallery'),
                    maxBytes: 15000000 // Increased limit for multiple files
                }, (err, files) => {
                    if (err) return reject(err);
                    resolve(files);
                });
            });

            uploadedFiles = allImages.map(f => f.fd);

            if (allImages.length === 0) {
                return exits.badRequest({ message: 'At least one image is required.' });
            }

            // 2. Helper to parse JSON
            const parseJson = (val) => {
                if (typeof val === 'string') {
                    try { return JSON.parse(val); } catch (e) { return val; }
                }
                return val;
            };

            // 3. Prepare Tour data
            const tourData = {
                title: inputs.title,
                location: inputs.location,
                tour_type: inputs.tour_type,
                description: inputs.description,
                current_price: inputs.current_price,
                old_price: inputs.old_price,
                days: inputs.days,
                nights: inputs.nights,
                group_size: inputs.group_size,
                ages: inputs.ages,
                rating: inputs.rating,
                badge_text: inputs.badge_text,
                reviews_count: 0,
                tour_language: parseJson(inputs.tour_language) || ["English"],
                features: parseJson(inputs.features) || { best_price: false, free_cancel: false, is_featured: false }
            };

            const itineraries = parseJson(inputs.itineraries) || [];
            const faqs = parseJson(inputs.faqs) || [];
            const inclusions = parseJson(inputs.inclusions) || [];
            const exclusions = parseJson(inputs.exclusions) || [];

            // 4. Create Tour and associated records using a transaction
            const newTour = await sails.getDatastore().transaction(async (db) => {
                const tour = await Tour.create(tourData).fetch().usingConnection(db);

                // Create TourImage records for ALL uploaded files
                const imageRecords = allImages.map((file, index) => ({
                    image_url: `/uploads/gallery/${path.basename(file.fd)}`,
                    tour: tour.id,
                    is_primary: index === 0 // First image is primary by default
                }));

                await TourImage.createEach(imageRecords).usingConnection(db);

                // Nested resources
                if (itineraries.length > 0) {
                    await TourItinerary.createEach(itineraries.map(i => ({ ...i, tour: tour.id }))).usingConnection(db);
                }
                if (faqs.length > 0) {
                    await TourFaq.createEach(faqs.map(f => ({ ...f, tour: tour.id }))).usingConnection(db);
                }
                if (inclusions.length > 0) {
                    await TourInclusion.createEach(inclusions.map(inc => ({ item: inc.item || inc, tour: tour.id }))).usingConnection(db);
                }
                if (exclusions.length > 0) {
                    await TourExclusion.createEach(exclusions.map(exc => ({ item: exc.item || exc, tour: tour.id }))).usingConnection(db);
                }

                return tour;
            });

            return exits.success(newTour);

        } catch (error) {
            sails.log.error('Error creating tour:', error);
            // Cleanup files if error occurs
            uploadedFiles.forEach(fPath => {
                if (fPath && fs.existsSync(fPath)) {
                    try { fs.unlinkSync(fPath); } catch (e) { sails.log.error('Cleanup error:', e); }
                }
            });
            // Use the 'error' exit which is set to responseType: 'serverError'
            return exits.error(error);
        }
    }
};
