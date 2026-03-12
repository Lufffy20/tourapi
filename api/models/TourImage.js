/**
 * TourImage.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    image_url: {
      type: 'string',
      required: true,
      description: 'The URL or path of the image'
    },
    tour: {
      model: 'tour',
      description: 'The tour this image belongs to'
    },
    is_primary: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Flags if this is the main photo for the tour.'
    }
  },
};
