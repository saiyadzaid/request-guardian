const { body } = require('express-validator');

module.exports = {
    '/api/authentication/signup': [
        body('email').isEmail(),
        body('password').isLength({ min: 8 }),
    ]
};
