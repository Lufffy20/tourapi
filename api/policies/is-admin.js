/**
 * is-admin
 *
 * A simple policy that allows any request from an admin user.
 *
 * For more information about policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports = async function (req, res, proceed) {

    // Check if user is logged in (req.user should be set by is-logged-in policy)
    if (!req.user) {
        return res.unauthorized({ message: 'Authentication required.' });
    }

    // Check if user is an admin (role 1)
    if (req.user.role !== 1) {
        return res.forbidden({ message: 'Admin access required.' });
    }

    // If both checks pass, proceed
    return proceed();

};
