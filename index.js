const { validationResult, ValidationChain } = require('express-validator');

async function validate(req, res, next) {
    try {
        let validations = require('../../utils/validations/index.js')[req.path];
        if (!validations) return next();
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }
    
        const errors = validationResult(req);
        delete req.validations;
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ errors: errors.array() });
    } catch (error) {
        let message = error.message;
        if (error.code === 'MODULE_NOT_FOUND') {
            message = `Validations rules not found for ${req.path}`;
        }
        res.status(400).json({ errors: message });
    }
};

module.exports = validate;