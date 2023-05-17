const { validationResult } = require('express-validator');
const path = require('path');

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
            res.status(422).json({ data: errors.array() });
        } catch (error) {
            let message = error.message;
            if (error.code === 'MODULE_NOT_FOUND') {
                message = `Validations rules not found for ${req.path}`;
            }
            res.status(400).json({ data: message });
        }
    };
}
function validate(app) {
    try {
        for (const key in require(path.resolve('utils/validations/index'))) {
            app.use(key, runValidator(require(path.resolve('utils/validations/index'))[key]));
        }
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log(`Validations rules not found at utils/validations/index.js`)
        }
    }
}
module.exports = validate;