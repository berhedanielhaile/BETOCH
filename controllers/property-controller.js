const multer = require('multer');
const Property = require('../models/property-model');

// const ApiFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handler-factory');
// exports.resizePhoto = catchAsync(async (req, res, next) => {
//   const multerFilter = multer.filter;
// });
exports.getPropertyStats = catchAsync(async (req, res, next) => {
  const stats = await Property.aggregate([
    {
      $match: { rent: { $gte: 0 } },
    },
    {
      $group: {
        _id: '$type',
        numProperty: { $sum: 1 },
        avgRent: { $avg: '$rent' },
        minRent: { $min: '$rent' },
        maxRent: { $max: '$rent' },
        moneySaved: { $sum: { $multiply: [0.2, '$rent'] } },
      },
    },
    {
      $sort: { avgRent: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    stats,
  });
});
exports.getProperty = getOne(Property, { path: 'reviews' });
exports.getAllProperties = getAll(Property);
exports.createProperty = createOne(Property);
exports.updateProperty = updateOne(Property);
exports.deleteProperty = deleteOne(Property);
