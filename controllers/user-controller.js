const sharp = require('sharp');
const multer = require('multer');
const User = require('../models/user-model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, getOne, getAll } = require('./handler-factory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('not an image, please enter the correct data type!', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();
  await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile('public/img/users');
  next();
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('this route is not for password update,please use /updateMyPassword', 400));

  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'phoneNumber',
    'photo',
    'bio',
    'address',
    'notificationPreferences',
    'notifEnquiries',
    'notifAccount',
  );

  if (!filteredBody.phoneNumber || filteredBody.phoneNumber.trim() === '') {
    delete filteredBody.phoneNumber;
  }

  if (!filteredBody.bio || filteredBody.bio.trim() === '') {
    delete filteredBody.bio;
  }

  // Handle photo upload
  if (req.file) {
    const filename = `user-${req.user._id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${filename}`);

    filteredBody.photo = filename;
  }

  if (req.body.notifEnquiries !== undefined || req.body.notifAccount !== undefined) {
    const enquiriesValue =
      typeof req.body.notifEnquiries === 'string' ? req.body.notifEnquiries === 'true' : req.body.notifEnquiries;
    const accountValue =
      typeof req.body.notifAccount === 'string' ? req.body.notifAccount === 'true' : req.body.notifAccount;

    filteredBody.notificationPreferences = {
      enquiries: enquiriesValue !== undefined ? enquiriesValue : (req.user.notificationPreferences?.enquiries ?? true),
      account: accountValue !== undefined ? accountValue : (req.user.notificationPreferences?.account ?? true),
    };
    delete filteredBody.notifEnquiries;
    delete filteredBody.notifAccount;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false }, { new: true, runValidators: true });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getUser = getOne(User);
exports.getAllUsers = getAll(User);
exports.deleteUser = deleteOne(User);
exports.updateUser = updateOne(User);
