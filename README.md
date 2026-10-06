# Readme for Request-Guardian

`request-guardian` is a middleware function that validates incoming requests against a set of validation rules using `express-validator`. It can be used to ensure that data sent to a server is in the expected format and meets certain criteria. If the validation fails, it returns a 422 error response with an array of validation errors.

## Installation

To install `request-guardian`, use `npm` or `yarn`.

```bash
npm install request-guardian
```

```bash
yarn add request-guardian
```

## Usage

`request-guardian` is a middleware function that can be used with `Express` applications. To use it, simply require the module and use it as middleware for your routes.

NOTE: Make sure that you call the validate() method after a middleware to parse incoming requests with JSON payloads.

```javascript
const express = require('express');
const validate = require('request-guardian');

const app = express();

// middleware to parse incoming requests with JSON payloads.
app.use(express.json());

// Use Request Guardian middleware
validate(app);

// define your routes
app.post('/users', (req, res) => {
    // handle validated request
});
```

Validation rules are defined in `utils/validations/index.js`. Each route can either use a single array of validation chains for all methods, or a method-specific object when the same path should validate differently by HTTP method.

This is useful when the same route name is reused for different methods such as `GET` and `POST` but each method needs different validation logic.

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

You can also use a single validation array for all methods on a route:

```javascript
module.exports = {
    '/api/users': [
        body('name').notEmpty(),
    ],
};
```

If no validation rules are found for the current route, `request-guardian` will simply pass the request to the next middleware function in the stack.