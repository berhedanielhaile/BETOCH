const express = require('express');

const router = express.Router();
const {
  getAllProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  createProperty,
  getPropertyStats,
  uploadPropertyMedia,
  resizePropertyMedia,
} = require('../controllers/property-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');
const reviewRouter = require('./review-routes');

router.use('/:propertyId/reviews', reviewRouter);
router.route('/property-stats').get(protect, getPropertyStats);

router
  .route('/')
  .get(getAllProperties)
  .post(protect, restrictTo('landlord'), uploadPropertyMedia, resizePropertyMedia, createProperty);

router.use(protect);
router
  .route('/:id')
  .get(getProperty)
  .patch(restrictTo('landlord'), uploadPropertyMedia, resizePropertyMedia, updateProperty)
  .delete(restrictTo('admin', 'landlord'), deleteProperty);

module.exports = router;
