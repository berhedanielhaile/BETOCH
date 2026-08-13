const express = require('express');
const path = require('path');
const morgan = require('morgan');
const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/user-routes');
const propertyRouter = require('./routes/property-routes');
const reviewRouter = require('./routes/review-routes');
const enquiryRouter = require('./routes/enquiry-routes');
const viewRouter = require('./routes/view-routes');
const globalErrorHandler = require('./controllers/error-controller');
const AppError = require('./utils/AppError');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1)Global-middleware
//Set Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

//Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//limit requests from the same IP
const limit = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Try again in an hour.',
});
app.use('/api', limit);

// Body parser,reading data from body into req.body
app.set('query parser', 'extended');
app.use(express.json());

//Data Sanitization against NoSQL query injection
app.use((req, res, next) => {
  try {
    mongoSanitize()(req, res, next);
  } catch (error) {
    next();
  }
});

//Data sanitization against xss
app.use((req, res, next) => {
  try {
    xss()(req, res, next);
  } catch (error) {
    next();
  }
});

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'location',
      ' city',
      'subcity',
      'woreda',
      'kebele',
      'rent',
      ' bedroom',
      'bathroom',
      'furnished',
      'utilities',
    ],
  }),
);
//serving static files

//(2 Routes

app.use('/', viewRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/property', propertyRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/enquiries', enquiryRouter);

//error handling middleware
app.use((req, res, next) => {
  // Ignore Chrome DevTools and other automated requests to reduce error logs
  if (req.path.includes('.well-known') || req.path.includes('bundle.js.map')) {
    return res.status(404).end();
  }
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handling middleware
app.use(globalErrorHandler);
module.exports = app;
