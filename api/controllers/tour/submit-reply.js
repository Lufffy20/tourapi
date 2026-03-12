module.exports = {
    friendlyName: 'Submit Reply',
    description: 'Authenticated users can reply to a tour review.',
    inputs: {
        reviewId: {
            type: 'number',
            required: true,
            description: 'The ID of the parent review being replied to'
        },
        comment: {
            type: 'string',
            required: true,
            description: 'The reply text'
        }
    },
    exits: {
        success: { description: 'Reply submitted successfully.' },
        notFound: { responseType: 'notFound' },
        unauthorized: { responseType: 'unauthorized' },
        error: { responseType: 'serverError' }
    },
    fn: async function (inputs, exits) {
        try {
            // 1. Verify parent review exists
            const parentReview = await TourReview.findOne({ id: inputs.reviewId });
            if (!parentReview) {
                return exits.notFound({ success: false, message: 'Parent review not found.' });
            }

            // 2. Prevent self-reply
            const user = this.req.user;
            if (user.email === parentReview.reviewer_email) {
                return exits.success({
                    success: false,
                    message: 'You cannot reply to your own review.'
                });
            }

            // 3. Get user from request (attached by is-logged-in policy)
            if (!user) {
                return exits.unauthorized({ success: false, message: 'You must be logged in to reply.' });
            }

            // 3. Create the reply
            // Replies inherit the tour association but have no ratings
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

            const reply = await TourReview.create({
                tour: parentReview.tour,
                parent: parentReview.id,
                reviewer_name: fullName || 'Anonymous User',
                reviewer_email: user.email,
                comment: inputs.comment,
                // Title and ratings are null for replies
            }).fetch();

            return exits.success({
                success: true,
                message: 'Reply posted successfully',
                data: reply
            });
        } catch (err) {
            sails.log.error(err);
            return exits.error({
                success: false,
                message: 'An unexpected error occurred while posting your reply.'
            });
        }
    }
};
