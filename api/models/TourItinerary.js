/**
 * TourItinerary.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    day_number: {
      type: 'number',
      required: true,
      description: 'The day number (e.g., 1, 2, 3)'
    },
    title: {
      type: 'string',
      required: true,
      description: 'The title of the day (e.g., Arrival at location)'
    },
    description: {
      type: 'string',
      columnType: 'text',
      description: 'Detailed description of the day activities'
    },
    time: {
      type: 'string',
      description: 'Time or subtitle for the day (e.g., 09:00 AM)'
    },
    tour: {
      model: 'tour',
      description: 'The tour this itinerary belongs to'
    }
  },
};
