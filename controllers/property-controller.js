const multer = require('multer');
const Property = require('../models/property-model');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handler-factory');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else if (file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image or video! Please upload only images or videos.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPropertyMedia = upload.fields([
  { name: 'photos', maxCount: 12 },
  { name: 'video', maxCount: 1 },
]);

exports.resizePropertyMedia = async (req, res, next) => {
  if (!req.files || (!req.files.photos && !req.files.video)) return next();

  if (req.files.photos && req.files.photos.length > 0) {
    req.body.photos = [];
    await Promise.all(
      req.files.photos.map(async (file) => {
        const filename = `property-${req.user.id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/properties/${filename}`);
        req.body.photos.push(filename);
      }),
    );
  }

  if (req.files.video && req.files.video.length > 0) {
    const file = req.files.video[0];
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `property-${req.user.id}-${Date.now()}-video${ext}`;
    const dir = 'public/img/properties/videos';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), file.buffer);
    req.body.video = filename;
  }

  next();
};

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

exports.createProperty = catchAsync(async (req, res, next) => {
  req.body.landlord = req.user;
  if (req.body.location) req.body.location = JSON.parse(req.body.location);
  if (req.body.amenities) req.body.amenities = JSON.parse(req.body.amenities);
  const doc = await Property.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateProperty = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError(
        'this route is not for updating your password,please send a patch request to /updateMyPassword route to update your password!',
        400,
      ),
    );
  }
  if (req.body.location) req.body.location = JSON.parse(req.body.location);
  if (req.body.amenities) req.body.amenities = JSON.parse(req.body.amenities);
  const updatedDoc = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedDoc) return next(new AppError('There is no document with this id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedDoc,
    },
  });
});

exports.deleteProperty = deleteOne(Property);
