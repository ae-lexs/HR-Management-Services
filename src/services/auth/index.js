const { Router } = require('express');

// Middlewares
const { errorHandler } = require('../../middlewares');

// Schemas
const { admin, user } = require('./schema');

// Controller
const { registerAdministrator } = require('./controller');

// Utils
const { writeNewError } = require('../../utils');

const router = Router();

router.post('/login', async (req, res) => {
  const { body, hostname, originalUrl } = req;

  // Destructuring elements from the validated request
  const { value, error } = await user.validate(body);

  if (error) {
    // Write Error
    writeNewError(
      'Invalid request syntax',
      400,
      `http://${hostname}${originalUrl}`,
    );

    // Send Log
    res.log.info(`Status: 400, Date: ${new Date()}`);

    return res.status(400).json({
      statusCode: 400,
      status: 'Bad Request',
      error: true,
      errorMessage: 'Invalid request syntax',
      errorData: error,
    });
  }

  return res.status(200).json({
    statusCode: 200,
    status: 'OK',
    data: null,
  });
});

router.post('/register', (req, res) => {
  res.status(200).json({
    statusCode: 200,
    status: 'OK',
    data: null,
  });
});

router.post(
  '/register-admin',
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    const { body, hostname, originalUrl } = req;

    // Destructuring elements from the validated request
    const { value, error } = await admin.validate(body);

    if (error) {
      // Write Error
      writeNewError(
        'Invalid request syntax',
        400,
        `http://${hostname}${originalUrl}`,
      );

      // Send Log
      res.log.info(`Status: 400, Date: ${new Date()}`);

      return res.status(400).json({
        statusCode: 400,
        status: 'Bad Request',
        error: true,
        errorMessage: 'Invalid request syntax',
        errorData: error,
      });
    }

    try {
      const response = await registerAdministrator(value);

      return res.status(200).json({
        statusCode: 200,
        status: 'OK',
        data: response,
        error: false,
      });
    } catch (err) {
      err.statusCode = 409;
      err.status = 'Conflict';
      next(err);
    }
  },
  errorHandler,
);

module.exports = router;
