const mongoose = require('mongoose');
const slugify = require('slugify');

const propertySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['house', 'condominium', 'studio', 'apartment', 'room-shared'],
      required: [true, 'You must specify the type of your property'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    location: {
      city: {
        type: String,
        default: 'Addis Ababa',
      },
      subcity: {
        type: String,
        trim: true,
      },
      woreda: {
        type: String,
        trim: true,
      },
      kebele: {
        type: String,
        trim: true,
      },
    },
    rent: {
      type: Number,
      required: [true, 'Please specify the monthly rent'],
      min: [0, 'Rent cannot be negative'],
    },
    bedroom: {
      type: Number,
      default: 1,
      min: [0, 'Bedrooms cannot be negative'],
    },
    bathroom: {
      type: Number,
      default: 1,
      min: [0, 'Bathrooms cannot be negative'],
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    utilities: {
      electricity: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
      internet: { type: Boolean, default: false },
      gas: { type: Boolean, default: false },
    },
    amenities: [String],
    petPolicy: {
      type: String,
      enum: ['allowed', 'not-allowed', 'negotiable'],
      default: 'not-allowed',
    },
    minStay: {
      type: String,
      default: 'unknown',
    },
    maxStay: {
      type: String,
      default: 'unknown',
    },
    description: {
      type: String,
      required: [true, 'Property must have a description'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    photos: [String],
    video: {
      type: String,
      validate: {
        validator: function (video) {
          if (!video) return true;
          return /\.(mp4|webm|mov)$/i.test(video);
        },
        message: 'Video must be mp4, webm, or mov format',
      },
    },
    slug: String,
    landlord: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Property must belong to a landlord'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'rented'],
      default: 'pending',
    },
    views: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "can't be less than 1!"],
      max: [5, "can't be greater than 5!"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: Number,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

propertySchema.index({ 'location.subcity': 1 });
propertySchema.index({ 'location.woreda': 1 });
propertySchema.index({ rent: 1 });
propertySchema.index({ type: 1 });

propertySchema.virtual('weekly-rent').get(function () {
  return this.rent / 4;
});
propertySchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'property',
  localField: '_id',
});
propertySchema.pre('save', function () {
  this.slug = slugify(this.title, { lowerCase: true });
});
propertySchema.pre(/^find/, function () {
  this.populate({
    path: 'landlord',
  });
});
propertySchema.pre(/^findOne/, function () {
  this.views += 1;
});
propertySchema.pre(/^find/, function () {
  this.find({ available: { $ne: false } });
});
// propertySchema.pre('aggregate', function () {
//   this.pipeline().unshift({ $match: { available: { $ne: false } } });
// });
const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
