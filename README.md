# Readme for Request-Guardian

`request-guardian` is a middleware function that validates incoming requests against a set of validation rules using `express-validator`. It can be used to ensure that data sent to a server is in the expected format and meets certain criteria. If the validation fails, it returns a 400 error response with an array of validation errors.

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

```javascript
const express = require('express');
const validate = require('request-guardian');

const app = express();

// Use Request Guardian middleware
validate(app);

// define your routes
app.post('/users', (req, res) => {
    // handle validated request
});
```

Validation rules are defined in separate files located in the `utils/validations/index.js` directory. `request-guardian` will look for a file with the same name as the current route and load any validation rules defined within that file.

```javascript
// utils/validations/index.js

const { body } = require('express-validator');

module.exports = {
    '/api/authentication/signup': [
        body('email').isEmail(),
        body('password').isLength({ min: 8 }),
    ]
} ;
```

If no validation rules are found for the current route, `request-guardian` will simply pass the request to the next middleware function in the stack.

## Keywords

express validator validation validate sanitize sanitization xss