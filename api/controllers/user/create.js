module.exports = {

    friendlyName: 'Create user',

    description: 'Create a new user account (Admin only/Internal).',

    inputs: {
        firstName: { type: 'string', required: true },
        lastName: { type: 'string', required: true },
        email: { type: 'string', required: true, isEmail: true },
        password: { type: 'string', required: true },
        phoneNumber: { type: 'string', required: true },
        role: { type: 'number', defaultsTo: 0 }
    },

    exits: {
        success: { statusCode: 201 },
        emailAlreadyInUse: { statusCode: 409, responseType: 'badRequest' }
    },

    fn: async function (inputs) {
        const email = inputs.email.toLowerCase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw { emailAlreadyInUse: { message: 'Email address already in use.' } };
        }

        const newUser = await User.create({
            ...inputs,
            email,
            emailStatus: 'confirmed' // Admin created users are pre-confirmed
        }).fetch();

        return newUser;
    }

};
