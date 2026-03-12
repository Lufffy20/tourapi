module.exports = {

    friendlyName: 'Update user',

    description: 'Update user details.',

    inputs: {
        id: { type: 'string', required: true },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        phoneNumber: { type: 'string' },
        role: { type: 'number' }
    },

    exits: {
        success: { description: 'User updated successfully.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },

    fn: async function (inputs) {
        try {
            const updatedUser = await User.updateOne({ id: inputs.id })
                .set({
                    firstName: inputs.firstName,
                    lastName: inputs.lastName,
                    phoneNumber: inputs.phoneNumber,
                    role: inputs.role
                });

            if (!updatedUser) {
                throw 'notFound';
            }

            return {
                success: true,
                message: 'User updated successfully.',
                data: updatedUser
            };
        } catch (err) {
            if (err === 'notFound') throw 'notFound';
            sails.log.error('Error updating user:', err);
            throw 'error';
        }
    }


};
