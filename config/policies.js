/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': 'is-logged-in',

  // Authentication and public routes
  'auth/*': true,
  'tour/get-all': true,
  'tour/find-one': true,
  'tour/get-booked-dates': true,
  'tour/get-reviews': true,
  'tour/submit-review': true,
  'tour/submit-reply': 'is-logged-in',

  // Admin and management routes
  'admin/*': ['is-logged-in', 'is-admin'],
  'user/*': ['is-logged-in', 'is-admin'],
  'favorite/*': 'is-logged-in',

};
