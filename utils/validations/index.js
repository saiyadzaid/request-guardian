const { body, query } = require('express-validator');

module.exports = {
    '/api/authentication/signup': {
        GET: [
            query('page').optional().isInt({ min: 1 }),
        ],
        POST: [
            body('email').isEmail(),
            body('password').isLength({ min: 8 }),
        ],
    },
};
