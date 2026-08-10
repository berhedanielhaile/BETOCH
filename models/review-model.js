const mongoose = require('mongoose');
const Property = require('./property-model');

const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cann't be empty!"],
    },
    rating: {
      type: Number,
      min: [1, "ratings can't be lower than 1"],
      max: [5, "ratings can't be greater than 5"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!'],
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property',
      required: [true, 'Review must belong to a property!'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
ReviewSchema.index({ property: 1, user: 1 }, { unique: true });
ReviewSchema.statics.calcAvgRatings = async function (propertyId) {
  const stats = await this.aggregate([
    {
      $match: { property: propertyId },
    },
    {
      $group: {
        _id: '$property',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  await Property.findByIdAndUpdate(propertyId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating,
  });
};
ReviewSchema.post('save', async function () {
  await this.constructor.calcAvgRatings(this.property);
});
ReviewSchema.pre(/^findByIdAnd/, async function () {
  this.r = await this.findOne();
});

ReviewSchema.post(/^findByIdAnd/, async function () {
  if (!this.r) return;

  await this.r.constructor.calcAvgRatings(this.r.property);
});
ReviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name email',
  });
});

const ReviewModel = mongoose.model('Review', ReviewSchema);
module.exports = ReviewModel;
