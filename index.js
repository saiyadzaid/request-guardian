const { validationResult } = require('express-validator');
const path = require('path');

const VALID_HTTP_METHODS = new Set([
    'all',
    'get',
    'post',
    'put',
    'delete',
    'patch',
    'options',
    'head',
]);

function runValidator(validations) {
    return async function _runValidator(req, res, next) {
        try {
            if (!validations) return next();
            for (let validation of validations) {
                const result = await validation.run(req);
                if (result.errors.length) break;
            }
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }
            res.status(422).json({
                data: errors.array(),
                status: 'VALIDATION_ERROR',
                message: 'Invalid Data, Validation Failed.',
            });
        } catch (error) {
            let message = error.message;
            if (error.code === 'MODULE_NOT_FOUND') {
                message = `Validations rules not found for ${req.path}`;
            }
            res.status(400).json({
                data: message,
                status: 'BAD_REQUEST',
                message: message,
            });
        }
    };
}

function registerRouteValidation(app, routeName, validationConfig) {
    if (!validationConfig) return;

    if (Array.isArray(validationConfig)) {
        app.use(routeName, runValidator(validationConfig));
        return;
    }

    if (typeof validationConfig !== 'object') {
        return;
    }

    for (const [method, rules] of Object.entries(validationConfig)) {
        const normalizedMethod = method.toLowerCase();

        if (!VALID_HTTP_METHODS.has(normalizedMethod)) {
            continue;
        }

        if (Array.isArray(rules)) {
            if (normalizedMethod === 'all') {
                app.use(routeName, runValidator(rules));
                continue;
            }

            app[normalizedMethod](routeName, runValidator(rules));
        }
    }
}

function validate(app) {
    try {
        const validationRules = require(path.resolve('utils/validations/index'));

        for (const [key, value] of Object.entries(validationRules || {})) {
            registerRouteValidation(app, key, value);
        }
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log(`Validations rules not found at utils/validations/index.js`);
        }
    }
}

module.exports = validate;