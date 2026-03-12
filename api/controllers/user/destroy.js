module.exports = {

    friendlyName: 'Delete user',

    description: 'Delete a user from the system.',

    inputs: {
        id: { type: 'string', required: true }
    },

    exits: {
        success: { description: 'User deleted successfully.' },
        notFound: { responseType: 'notFound' },
        error: { responseType: 'serverError' }
    },

    fn: async function (inputs) {
        try {
            const deletedUser = await User.destroyOne({ id: inputs.id });

            if (!deletedUser) {
                throw 'notFound';
            }

            return {
                success: true,
                message: 'User deleted successfully',
                data: deletedUser
            };
        } catch (err) {
            if (err === 'notFound') throw 'notFound';
            sails.log.error('Error deleting user:', err);
            throw 'error';
        }
    }


};
