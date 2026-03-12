/**
 * Tour.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        title: {
            type: 'string',
            required: true,
            description: 'The name of the tour trip.'
        },

        location: {
            type: 'string',
            required: true,
            description: 'The primary location of the tour (e.g., Phuket, Bangkok).'
        },

        tour_type: {
            type: 'string',
            columnName: 'tour_type',
            description: 'The category of the tour.'
        },

        description: {
            type: 'string',
            columnType: 'text',
            description: 'Detailed description of the tour.'
        },

        days: {
            type: 'number',
            description: 'Number of days.'
        },

        nights: {
            type: 'number',
            description: 'Number of nights.'
        },
        group_size: {
            type: 'string',
            columnName: 'group_size',
            description: 'The maximum group size (e.g., 10 people).'
        },
        ages: {
            type: 'string',
            columnName: 'ages',
            description: 'The target age group (e.g., 18-99 yrs).'
        },

        current_price: {
            type: 'number',
            required: true,
            columnName: 'current_price',
            description: 'The base price of the tour.'
        },

        old_price: {
            type: 'number',
            columnName: 'old_price',
            description: 'The old price of the tour.'
        },

        rating: {
            type: 'number',
            defaultsTo: 0,
            columnName: 'rating',
            description: 'Average user rating.'
        },

        badge_text: {
            type: 'string',
            columnName: 'badge_text',
            description: 'A promotional badge text (e.g., 20% OFF).'
        },

        reviews_count: {
            type: 'number',
            defaultsTo: 0,
            columnName: 'reviews_count',
            description: 'Total number of reviews.'
        },

        tour_language: {
            type: 'json',
            columnName: 'tour_language',
            description: 'List of languages available for this tour (stored as array).'
        },

        features: {
            type: 'json',
            description: 'Array or object containing features like best_price, free_cancel, is_featured.'
        },

        images: {
            collection: 'tourimage',
            via: 'tour'
        },

        itineraries: {
            collection: 'touritinerary',
            via: 'tour'
        },

        inclusions: {
            collection: 'tourinclusion',
            via: 'tour'
        },

        exclusions: {
            collection: 'tourexclusion',
            via: 'tour'
        },

        faqs: {
            collection: 'tourfaq',
            via: 'tour'
        },
        reviews: {
            collection: 'tourreview',
            via: 'tour'
        }

    },

};
