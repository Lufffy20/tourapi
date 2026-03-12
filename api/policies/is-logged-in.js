/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more information about policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const jwt = require('jsonwebtoken');

module.exports = async function (req, res, proceed) {

    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.unauthorized({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, sails.config.custom.jwtSecret);

        // Find the user to ensure they still exist and are active
        const user = await User.findOne({ id: decoded.id });

        if (!user) {
            return res.unauthorized({ message: 'User not found.' });
        }

        // Attach user to request
        req.user = user;

        return proceed();
    } catch (err) {
        return res.unauthorized({ message: 'Invalid or expired token.' });
    }

};
