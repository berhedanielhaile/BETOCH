const express = require('express');

const router = express.Router();
const {
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  createProperty,
  getPropertyStats,
} = require('../controllers/property-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');
const reviewRouter = require('./review-routes');

router.use('/:propertyId/reviews', reviewRouter);
router.route('/property-stats').get(protect, getPropertyStats);

router.route('/').get(getAllProperties).post(protect, restrictTo('landlord'), createProperty);

router.use(protect);
router
  .route('/:id')
  .get(getProperty)
  .patch(restrictTo('landlord'), updateProperty)
  .delete(restrictTo('admin', 'landlord'), deleteProperty);

module.exports = router;
