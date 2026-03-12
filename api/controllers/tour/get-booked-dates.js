module.exports = {

    friendlyName: 'Get booked dates',

    description: 'Get all booked dates for a specific tour to display on the availability calendar.',

    inputs: {
        id: {
            type: 'number',
            required: true,
            description: 'The ID of the tour.'
        }
    },

    exits: {
        success: {
            description: 'Successfully retrieved booked dates.'
        },
        notFound: {
            responseType: 'notFound',
            description: 'Tour not found.'
        }
    },

    fn: async function (inputs) {
        // 1. Check if tour exists
        const tour = await Tour.findOne({ id: inputs.id });
        if (!tour) {
            throw 'notFound';
        }

        // 2. Fetch all successful bookings for this tour
        const bookings = await Booking.find({
            tourId: inputs.id,
            paymentStatus: 'paid'
        });

        const bookedDates = [];
        const currentYear = new Date().getFullYear();

        // 3. Helper to parse date range strings like "Feb 05 ~ Feb 14"
        bookings.forEach(booking => {
            if (booking.bookingDate && booking.bookingDate.includes('~')) {
                const [startStr, endStr] = booking.bookingDate.split('~').map(s => s.trim());

                // Use native Date parsing
                let start = new Date(`${startStr} ${currentYear}`);
                let end = new Date(`${endStr} ${currentYear}`);

                // Ensure dates are valid
                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    // Iterate through days
                    let current = new Date(start);
                    while (current <= end) {
                        // Format to YYYY-MM-DD manually
                        const year = current.getFullYear();
                        const month = String(current.getMonth() + 1).padStart(2, '0');
                        const day = String(current.getDate()).padStart(2, '0');
                        const dateStr = `${year}-${month}-${day}`;

                        if (!bookedDates.includes(dateStr)) {
                            bookedDates.push(dateStr);
                        }

                        // Increment by one day
                        current.setDate(current.getDate() + 1);
                    }
                }
            }
        });

        return {
            success: true,
            data: bookedDates
        };
    }

};
