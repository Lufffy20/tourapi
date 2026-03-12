module.exports = {

    attributes: {

        tourId: {
            type: 'number',
            required: true
        },

        userId: {
            model: 'user'
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

        paymentStatus: {
            type: 'string',
            isIn: ['pending', 'paid', 'failed'],
            defaultsTo: 'pending'
        },

        paymentIntentId: {
            type: 'string'
        },

        paymentMethod: {
            type: 'string'
        }

    }

};