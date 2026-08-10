const express = require('express');
const {
  GetAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setPropetyUserIds,
} = require('../controllers/review-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.route('/').get(GetAllReviews).post(restrictTo('tenant'), setPropetyUserIds, createReview);
router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('tenant', 'admin'), updateReview)
  .delete(restrictTo('tenant', 'admin'), deleteReview);

module.exports = router;
