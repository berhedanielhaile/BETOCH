const express = require('express');
const {
  getHomePage,
  getPropertyListings,
  getPropertyDetails,
  showloginForm,
  showsignupForm,
  showUserDashboard,
  showPostlistingForm,
  showMyListings,
  showEnquiriesPage,
  showAccountSettings,
  showForgotPasswordForm,
  showResetPasswordForm,
} = require('../controllers/view-controller');
const { isLoggedIn, protect } = require('../controllers/auth-controller');
const AppError = require('../utils/AppError');

const router = express.Router();

router.use(isLoggedIn);

router.get('/login', showloginForm);
router.get('/signup', showsignupForm);
router.get('/forgot-password', showForgotPasswordForm);
router.get('/reset-password/:resetToken', showResetPasswordForm);
router.get('/', getHomePage);
router.get('/property-listings', getPropertyListings);

router.get('/dashboard', showUserDashboard);
router.get('/post-listing', showPostlistingForm);
router.get('/my-listings', showMyListings);
router.get('/enquiries', showEnquiriesPage);
router.get('/account-settings', showAccountSettings);

// Property slug route - must be last to avoid matching other routes
// Only match paths that don't match known routes
router.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;
  
  // List of known route paths that should not be treated as property slugs
    const knownRoutes = ['login', 'signup', 'dashboard', 'post-listing', 'my-listings', 'enquiries', 'account-settings', 'property-listings', 'forgot-password', 'reset-password', 'bundle.js.map'];
  
  // Check if this is a known route
  if (knownRoutes.includes(slug)) {
    return next(new AppError('Route not found', 404));
  }
  
  // Check if URL contains query parameters
  if (req.originalUrl.includes('?')) {
    return next(new AppError('Route not found', 404));
  }
  
  // Check if the slug contains dots (indicating file requests like .well-known, .json, etc.)
  if (slug.includes('.') || slug.includes('.well-known')) {
    return next(new AppError('Route not found', 404));
  }
  
  // Check if the original URL starts with /.well-known/
  if (req.originalUrl.startsWith('/.well-known/')) {
    return next(new AppError('Route not found', 404));
  }
  
  getPropertyDetails(req, res, next);
});

module.exports = router;
