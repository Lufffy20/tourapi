/**
 * TourExclusion.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    item: {
      type: 'string',
      required: true,
      description: 'What is excluded (e.g., Flights, Personal expenses)'
    },
    tour: {
      model: 'tour',
      description: 'The tour this exclusion belongs to'
    }
  },
};
