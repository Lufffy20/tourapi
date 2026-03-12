/**
 * TourInclusion.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    item: {
      type: 'string',
      required: true,
      description: 'What is included (e.g., Breakfast, Guide)'
    },
    tour: {
      model: 'tour',
      description: 'The tour this inclusion belongs to'
    }
  },
};
