/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'POST /api/v1/auth/signup': { action: 'auth/signup' },
  'POST /api/v1/auth/login': { action: 'auth/login' },
  'POST /api/v1/auth/forgot-password': { action: 'auth/forgot-password' },
  'POST /api/v1/auth/reset-password': { action: 'auth/reset-password' },
  'POST /api/v1/auth/resend-verification': { action: 'auth/resend-verification' },
  'GET /api/v1/auth/verify-email': { action: 'auth/verify-email' },

  'GET /api/v1/tours': { action: 'tour/get-all' },
  'GET /api/v1/tours/:id': { action: 'tour/get-tour-details' },
  'GET /api/v1/tours/:id/booked-dates': { action: 'tour/get-booked-dates' },

  'GET /api/v1/admin/tours': { action: 'admin/get-tours' },
  'POST /api/v1/admin/tours': { action: 'admin/create-tour' },
  'PATCH /api/v1/admin/tours/:id': { action: 'admin/update-tour' },
  'DELETE /api/v1/admin/tours/:id': { action: 'admin/destroy-tour' },

  'GET /api/v1/admin/users': { action: 'user/find' },
  'POST /api/v1/admin/users': { action: 'user/create' },
  'PATCH /api/v1/admin/users/:id': { action: 'user/update' },
  'DELETE /api/v1/admin/users/:id': { action: 'user/destroy' },

  // Itinerary Admin Routes
  'POST /api/v1/admin/tours/:tourId/itinerary': { action: 'admin/itinerary/create' },
  'GET /api/v1/admin/itinerary/:id': { action: 'admin/itinerary/view' },
  'PATCH /api/v1/admin/itinerary/:id': { action: 'admin/itinerary/update' },
  'DELETE /api/v1/admin/itinerary/:id': { action: 'admin/itinerary/delete' },

  // FAQ Admin Routes
  'POST /api/v1/admin/tours/:tourId/faq': { action: 'admin/faq/create' },
  'GET /api/v1/admin/faq/:id': { action: 'admin/faq/view' },
  'PATCH /api/v1/admin/faq/:id': { action: 'admin/faq/update' },
  'DELETE /api/v1/admin/faq/:id': { action: 'admin/faq/delete' },

  // Inclusions/Exclusions Admin Routes
  'POST /api/v1/admin/tours/:tourId/inclusion': { action: 'admin/inclusions/create' },
  'GET /api/v1/admin/inclusion/:id': { action: 'admin/inclusions/view' },
  'PATCH /api/v1/admin/inclusion/:id': { action: 'admin/inclusions/update' },
  'DELETE /api/v1/admin/inclusion/:id': { action: 'admin/inclusions/delete' },
  'POST /api/v1/admin/tours/:tourId/exclusion': { action: 'admin/exclusions/create' },
  'GET /api/v1/admin/exclusion/:id': { action: 'admin/exclusions/view' },
  'PATCH /api/v1/admin/exclusion/:id': { action: 'admin/exclusions/update' },
  'DELETE /api/v1/admin/exclusion/:id': { action: 'admin/exclusions/delete' },
  'POST /api/v1/admin/tours/:tourId/image': { action: 'admin/image/create' },
  'DELETE /api/v1/admin/image/:id': { action: 'admin/image/delete' },
  'PATCH /api/v1/admin/image/:id/primary': { action: 'admin/image/set-primary' },

  // Review Admin Routes
  'POST /api/v1/admin/tours/:tourId/review': { action: 'admin/review/create' },
  'GET /api/v1/admin/review/:id': { action: 'admin/review/view' },
  'PATCH /api/v1/admin/review/:id': { action: 'admin/review/update' },
  'DELETE /api/v1/admin/review/:id': { action: 'admin/review/delete' },

  // Public Review Routes
  'GET /api/v1/tour/:tourId/reviews': { action: 'tour/get-reviews' },
  'POST /api/v1/tour/:tourId/submit-review': { action: 'tour/submit-review' },
  'POST /api/v1/review/:reviewId/reply': { action: 'tour/submit-reply' },

  // Booking Routes
  'POST /api/v1/booking': { action: 'booking/create-booking' },

  // Favorite Routes
  'GET /api/v1/favorites': { action: 'favorite/list' },
  'POST /api/v1/favorites': { action: 'favorite/add' },
  'DELETE /api/v1/favorites/:tourId': { action: 'favorite/remove' },

  // Stripe Webhook Route
  'POST /api/v1/stripe/webhook': { action: 'stripe/webhook' },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
};
