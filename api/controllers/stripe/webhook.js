/**
 * Stripe Webhook Controller for Tourapi
 *
 * Purpose:
 * Handles asynchronous events from Stripe.
 * - Verifies webhook signature to ensure authenticity
 * - Handles payment_intent.succeeded: Updates booking status to 'paid'
 * - Handles payment_intent.payment_failed: Updates booking status to 'failed'
 */

module.exports = {

    friendlyName: 'Stripe Webhook',

    description: 'Handle incoming Stripe webhooks for Tourapi.',

    // This action accepts raw body for Stripe signature verification
    // Note: ensure your Sails config (e.g. config/http.js) preserves `req.rawBody` for Stripe
    inputs: {},

    exits: {
        success: { description: 'Webhook acknowledged.' },
        badRequest: { responseType: 'badRequest' },
        serverError: { responseType: 'serverError' }
    },

    fn: async function (inputs) {
        const stripe = require('stripe')(sails.config.custom.stripeSecretKey);
        const sig = this.req.headers['stripe-signature'];
        const webhookSecret = sails.config.custom.stripeWebhookSecret;

        let event;

        // 1. Verify Signature
        try {
            if (!webhookSecret) {
                sails.log.error('Stripe Webhook Error: STRIPE_WEBHOOK_SECRET not configured.');
                throw new Error('Configuration Missing');
            }

            // Sails usually parses bodies. Stripe needs raw body.
            // Using `req.rawBody` assuming raw-body parser middleware is present,
            // otherwise falling back to stringified body (might fail signature check if formatted differently).
            const payload = this.req.rawBody || JSON.stringify(this.req.body);

            event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

        } catch (err) {
            sails.log.warn(`Webhook signature verification failed.`, err.message);
            return this.res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // 2. Handle Events
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await handlePaymentSuccess(paymentIntent);
                break;

            case 'payment_intent.payment_failed':
                const paymentIntentFailed = event.data.object;
                await handlePaymentFailure(paymentIntentFailed);
                break;

            default:
                // Unexpected event type
                sails.log.info(`Unhandled Stripe webhook event type: ${event.type}`);
        }

        // Return 200 to acknowledge receipt
        return this.res.json({ received: true });
    }
};

/**
 * Handle Successful Payment
 * - Find ongoing Booking by paymentIntentId
 * - If found, update status to 'paid'
 */
async function handlePaymentSuccess(paymentIntent) {
    try {
        const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });

        if (booking) {
            if (booking.paymentStatus !== 'paid') {
                await Booking.updateOne({ id: booking.id }).set({
                    paymentStatus: 'paid'
                });
                sails.log.info(`[Webhook] Booking ${booking.id} marked as paid from Stripe Webhook.`);
            } else {
                sails.log.info(`[Webhook] Payment succeeded for Booking ${booking.id}, already marked as paid.`);
            }
        } else {
            sails.log.warn(`[Webhook] Booking not found for PaymentIntent ${paymentIntent.id}.`);
        }
    } catch (err) {
        sails.log.error('Error handling payment success webhook:', err);
    }
}

/**
 * Handle Failed Payment
 * - Find Booking
 * - Mark as failed
 */
async function handlePaymentFailure(paymentIntent) {
    try {
        const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });

        if (booking && booking.paymentStatus !== 'failed') {
            await Booking.updateOne({ id: booking.id }).set({
                paymentStatus: 'failed'
            });
            sails.log.info(`[Webhook] Booking ${booking.id} marked as failed from Stripe Webhook.`);
        }
    } catch (err) {
        sails.log.error('Error handling payment failures webhook:', err);
    }
}
