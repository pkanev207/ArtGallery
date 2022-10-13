const { COOKIE_SESSION_NAME } = require('../constants');
const { SECRET } = require('../config/env');
// const jwt = require('jsonwebtoken');
const jwt = require('../utils/jwt');

exports.auth = async (req, res, next) => {
    const token = req.cookies[COOKIE_SESSION_NAME];

    if (token) {
        const decodedToken = await jwt.verify(token, SECRET);
    }

    next();
};
