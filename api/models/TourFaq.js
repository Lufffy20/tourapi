/**
 * TourFaq.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    question: {
      type: 'string',
      required: true,
      description: 'The FAQ question'
    },
    answer: {
      type: 'string',
      columnType: 'text',
      required: true,
      description: 'The answer to the question'
    },
    tour: {
      model: 'tour',
      description: 'The tour this FAQ belongs to'
    }
  },
};
