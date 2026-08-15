const User = require('../models/user-model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, getOne, getAll } = require('./handler-factory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('this route is not for password update,please use /updateMyPassword', 400));
  
  const filteredBody = filterObj(req.body, 'name', 'email', 'phoneNumber', 'photo', 'bio', 'address');

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, { 
    new: true, 
    runValidators: true 
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
