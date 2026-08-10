const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data,  ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleDuplicateKeyError = (err) => {
  const message = `User with this ${Object.keys(err.keyValue)[0]} already exists`;
  return new AppError(message, 409);
};

const handleJWTError = () => new AppError('Invalid token,please login again!', 401);
const handleJWTExpiredError = () => new AppError('Your token expired,please login again!', 401);
const sendErrorDev = (err, req, res) => {
  // API requests return JSON
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      Error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Web requests render error page
    console.log('error💥💥', err);
    res.status(err.statusCode).render('error', {
      title: 'Error',
      error: err,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // API requests return JSON
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Something is very wrong',
    });
  }
  // Web requests render error page
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Error',
      error: {
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
      },
    });
  }
  return res.status(500).render('error', {
    title: 'Error',
    error: {
      status: 'error',
      statusCode: 500,
      message: 'Something went wrong. Please try again later.',
    },
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode * 1 || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    let error = { ...err, name: err.name, message: err.message, stack: err.stack };
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorDev(error, req, res);
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message, stack: err.stack };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.code === 11000) error = handleDuplicateKeyError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
