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
} = require('../controllers/view-controller');
const { isLoggedIn, protect } = require('../controllers/auth-controller');
const AppError = require('../utils/AppError');

const router = express.Router();

router.use(isLoggedIn);

router.get('/login', showloginForm);
router.get('/signup', showsignupForm);
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
  // List of known route paths that should not be treated as property slugs
  const knownRoutes = ['login', 'signup', 'dashboard', 'post-listing', 'my-listings', 'enquiries', 'account-settings', 'property-listings'];
  
  if (knownRoutes.includes(req.params.slug)) {
    return next(new AppError('Route not found', 404));
  }
  
  getPropertyDetails(req, res, next);
});

module.exports = router;
