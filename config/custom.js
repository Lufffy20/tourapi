/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  jwtSecret: process.env.JWT_SECRET,

  email: {
    from: '"Annaizu Tours" <verify@annaizu.com>',
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7ec7314d7fd0f7",
      pass: "3b212a7fd0a9e8"
    }
  },
  baseUrl: 'http://localhost:1337',
  frontendUrl: 'http://localhost:5173',

  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY

};
