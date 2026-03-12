/**
 * TourReview.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        reviewer_name: {
            type: 'string',
            required: true,
            description: 'Name of the reviewer'
        },
        reviewer_email: {
            type: 'string',
            required: true,
            isEmail: true,
            description: 'Email of the reviewer'
        },
        title: {
            type: 'string',
            description: 'Short title for the review'
        },
        comment: {
            type: 'string',
            columnType: 'text',
            required: true,
            description: 'Full review comment'
        },
        rating_location: {
            type: 'number',
            min: 1,
            max: 5,
            description: 'Location rating (1-5)'
        },
        rating_amenities: {
            type: 'number',
            min: 1,
            max: 5,
            description: 'Amenities rating (1-5)'
        },
        rating_food: {
            type: 'number',
            min: 1,
            max: 5,
            description: 'Food rating (1-5)'
        },
        rating_room: {
            type: 'number',
            min: 1,
            max: 5,
            description: 'Room rating (1-5)'
        },
        rating_price: {
            type: 'number',
            min: 1,
            max: 5,
            description: 'Price rating (1-5)'
        },
        rating_tour_operator: {
            type: 'number',
            min: 1,
            max: 5,
            description: 'Tour operator rating (1-5)'
        },
        overall_rating: {
            type: 'number',
            description: 'Computed overall rating (average of all sub-ratings)'
        },
        tour: {
            model: 'tour',
            description: 'The tour this review belongs to'
        },
        parent: {
            model: 'tourreview',
            description: 'The parent review if this is a reply'
        },
        replies: {
            collection: 'tourreview',
            via: 'parent',
            description: 'Replies to this review'
        }
    },
};
