const Review = require('../models/review-model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handler-factory');

exports.setPropetyUserIds = catchAsync(async (req, res, next) => {
  if (!req.body.property) req.body.property = req.params.propertyId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.findOne({ user: req.body.user, property: req.body.property });
  if (review)
    return next(
      new AppError(
        'this user already put his reviews, please use the /updateReview route to update your reviews!',
        400,
      ),
    );
  next();
});

exports.getReview = getOne(Review);
exports.GetAllReviews = getAll(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
