# Request Guardian

`request-guardian` registers [express-validator](https://express-validator.github.io/) rules on an Express app. Rules come from your project's `utils/validations/index.js`. Failed validation returns **422**. Unexpected errors while running validators return **400**.

## Installation

```bash
npm install request-guardian
```

```bash
yarn add request-guardian
```

This package depends on `express-validator`. Use it with Express.

## Usage

Call `validate(app)` **after** body parsers such as `express.json()`, and **before** you define route handlers. `validate` attaches middleware when it runs, so calling it after `app.post(...)` can skip validation.

```javascript
const express = require('express');
const validate = require('request-guardian');

const app = express();

app.use(express.json());
validate(app);

app.post('/users', (req, res) => {
    // request already passed validation for this path
});
```

Put validation rules in `utils/validations/index.js` at the **application root** (the process working directory), not inside `node_modules`. Keys must match the Express paths you register.

Each path can be:

- An **array** of validation chains: applied to every method (`app.use`).
- An **object** keyed by HTTP method: different rules for `GET`, `POST`, and other methods on the same path.

Supported method keys (case-insensitive): `all`, `get`, `post`, `put`, `delete`, `patch`, `options`, `head`. Unknown keys are ignored.

### Method-specific rules

Use this when the same path needs different rules per method:

```javascript
// utils/validations/index.js
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
```

`all` applies to every method on that path, the same as a bare array:

```javascript
module.exports = {
    '/api/reports': {
        all: [
            query('from').optional().isISO8601(),
        ],
    },
};
```

### Same rules for every method

```javascript
const { body } = require('express-validator');

module.exports = {
    '/api/users': [
        body('name').notEmpty(),
    ],
};
```

If a path is not listed, no validation middleware is attached for it. If `utils/validations/index.js` is missing, `validate()` logs `Validations rules not found at utils/validations/index.js` and registers nothing.

## Responses

Validation failure:

```json
{
    "data": [],
    "status": "VALIDATION_ERROR",
    "message": "Invalid Data, Validation Failed."
}
```

`data` is `express-validator`'s `errors.array()`.

Unexpected error while running validators:

```json
{
    "data": "error message",
    "status": "BAD_REQUEST",
    "message": "error message"
}
```

HTTP status codes: **422** for validation errors, **400** for other failures in the validator.
