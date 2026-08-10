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

const router = express.Router();

router.use(isLoggedIn);

router.get('/login', showloginForm);
router.get('/signup', showsignupForm);
router.get('/', getHomePage);
router.get('/browseProperties', getPropertyListings);
router.get('/property-listings', getPropertyListings);

router.get('/dashboard', showUserDashboard);
router.get('/post-listing', showPostlistingForm);
router.get('/my-listings', showMyListings);
router.get('/enquiries', showEnquiriesPage);
router.get('/account-settings', showAccountSettings);

router.get(`/:slug`, getPropertyDetails);

module.exports = router;
