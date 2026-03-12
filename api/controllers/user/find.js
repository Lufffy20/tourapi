module.exports = {

    friendlyName: 'Find all users',

    description: 'List all registered users.',

    inputs: {
        page: { type: 'number', defaultsTo: 1 },
        limit: { type: 'number', defaultsTo: 10 }
    },

    exits: {
        success: { description: 'Users fetched successfully.' },
        error: { description: 'Something went wrong.', responseType: 'serverError' }
    },

    fn: async function (inputs) {
        try {
            const skip = (inputs.page - 1) * inputs.limit;
            const users = await User.find({
                skip: skip,
                limit: inputs.limit,
                sort: 'createdAt DESC'
            });
            const total = await User.count();

            return {
                data: users,
                total: total,
                page: inputs.page,
                limit: inputs.limit
            };
        } catch (err) {
            sails.log.error('Error fetching users:', err);
            throw 'error';
        }
    }


};
