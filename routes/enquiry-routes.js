const express = require('express');
const {
  getAllEnquiries,
  createEnquiry,
  getEnquiry,
  deleteEnquiry,
  setPropertyUserIds,
  respondToEnquiry,
  getMyEnquiryForProperty,
} = require('../controllers/enquiry-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, restrictTo('landlord', 'admin'), getAllEnquiries)
  .post(protect, setPropertyUserIds, createEnquiry);

router.route('/me/:propertyId').get(protect, getMyEnquiryForProperty);
router.route('/:id/respond').patch(protect, respondToEnquiry);

router.route('/:id').get(protect, getEnquiry).delete(protect, restrictTo('admin', 'landlord'), deleteEnquiry);

module.exports = router;
