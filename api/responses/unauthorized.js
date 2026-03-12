/**
 * unauthorized.js
 *
 * A custom response for return code 401.
 */

module.exports = function unauthorized(data) {
    const res = this.res;
    return res.status(401).send(data);
};
