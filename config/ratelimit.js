/**
 * Rate Limit Settings
 * (sails.config.ratelimit)
 *
 * Configuration for the `sails-hook-rate-limit` hook.
 */

module.exports.ratelimit = {

    // The number of requests allowed per window.
    // (Set to 0 to disable rate limiting globally)
    // max: 100,

    // The window size in milliseconds.
    // windowMs: 15 * 60 * 1000, // 15 minutes

    // Individual route overrides
    routes: {
        'POST /api/v1/auth/login': {
            max: 5,
            windowMs: 15 * 60 * 1000, // 5 attempts per 15 minutes
            message: 'Too many login attempts from this IP, please try again after 15 minutes'
        },
        'POST /api/v1/auth/signup': {
            max: 3,
            windowMs: 60 * 60 * 1000, // 3 signups per hour
            message: 'Too many accounts created from this IP, please try again after an hour'
        },
        'POST /api/v1/auth/forgot-password': {

            max: 3,
            windowMs: 60 * 60 * 1000,
            message: 'Too many password reset requests, please try again after an hour'
        }
    }

};
