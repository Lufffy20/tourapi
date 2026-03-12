const stripe = require('stripe')(sails.config.custom.stripeSecretKey);

module.exports = {

  friendlyName: 'Create Booking',

  description: 'Create tour booking',

  inputs: {

    tourId: {
      type: 'number',
      required: true
    },

    adultCount: {
      type: 'number',
      defaultsTo: 0
    },

    youthCount: {
      type: 'number',
      defaultsTo: 0
    },

    childrenCount: {
      type: 'number',
      defaultsTo: 0
    },

    extraServiceBooking: {
      type: 'boolean',
      defaultsTo: false
    },

    extraServicePerson: {
      type: 'boolean',
      defaultsTo: false
    },

    totalPrice: {
      type: 'number',
      required: true
    },

    bookingDate: {
      type: 'string'
    },

    bookingTime: {
      type: 'string'
    },

    paymentMethodId: {
      type: 'string',
      required: true,
      description: 'Stripe Payment Method ID (tok_... or pm_...)'
    }

  },

  exits: {
    success: {
      description: 'Booking created'
    }
  },

  fn: async function (inputs) {

    try {

      // Ensure the user has a stripeCustomerId
      let stripeCustomerId = this.req.user.stripeCustomerId;

      // If the user somehow doesn't have a Stripe Customer ID, create one
      if (!stripeCustomerId) {
        stripeCustomerId = await sails.helpers.stripeCreateCustomer.with({
          email: this.req.user.email,
          name: this.req.user.fullName
        });

        await User.updateOne({ id: this.req.user.id }).set({ stripeCustomerId });
      }

      // Create a PaymentIntent (unconfirmed initially)
      const amountInCents = Math.round(inputs.totalPrice * 100);
      let paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        customer: stripeCustomerId,
        payment_method: inputs.paymentMethodId,
        confirm: false, // Do not confirm yet, just like newproject
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        },
        metadata: {
          tourId: inputs.tourId,
          userId: this.req.user.id
        }
      });

      // Create Pending Booking in Database
      let booking = await Booking.create({

        tourId: inputs.tourId,
        userId: this.req.user.id,
        adultCount: inputs.adultCount,
        youthCount: inputs.youthCount,
        childrenCount: inputs.childrenCount,
        extraServiceBooking: inputs.extraServiceBooking,
        extraServicePerson: inputs.extraServicePerson,
        totalPrice: inputs.totalPrice,
        bookingDate: inputs.bookingDate,
        bookingTime: inputs.bookingTime,

        paymentStatus: 'pending',
        paymentMethod: 'stripe',
        paymentIntentId: paymentIntent.id

      }).fetch();

      // Confirm PaymentIntent (Charge the Card)
      try {
        paymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);
      } catch (err) {
        sails.log.error(`Payment Confirmation Failed for Booking ${booking.id}:`, err);

        // Update Booking to Failed
        await Booking.updateOne({ id: booking.id }).set({
          paymentStatus: 'failed'
        });

        return {
          success: false,
          message: `Payment failed: ${err.message}`
        };
      }

      if (paymentIntent.status !== 'succeeded') {
        await Booking.updateOne({ id: booking.id }).set({
          paymentStatus: 'failed'
        });
        return {
          success: false,
          message: `Payment status: ${paymentIntent.status}`
        };
      }

      // If we reach here, payment succeeded
      await Booking.updateOne({ id: booking.id }).set({
        paymentStatus: 'paid'
      });

      return {
        success: true,
        message: 'Booking placed and payment successful.',
        data: {
          booking: booking,
          paymentId: paymentIntent.id
        }
      };

    } catch (error) {

      sails.log.error(error);

      return {
        success: false,
        message: 'Booking creation failed: ' + error.message
      };

    }

  }

};
