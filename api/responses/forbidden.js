/**
 * forbidden.js
 *
 * A custom response for return code 403.
 */

module.exports = function forbidden(data) {
    const res = this.res;
    return res.status(403).send(data);
};
