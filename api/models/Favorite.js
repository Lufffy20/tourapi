/**
 * Favorite.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        userId: {
            model: 'user',
            required: true,
            columnName: 'user_id'
        },

        tourId: {
            model: 'tour',
            required: true,
            columnName: 'tour_id'
        },

    },

};
