const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  // Handle both FormData and regular JSON
  const name = req.body.name || (req.body.firstName && req.body.lastName ? `${req.body.firstName} ${req.body.lastName}` : undefined);
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const role = req.body.role;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError('Please provide your name, email, password and password confirmation', 400));
  }

  const newUser = await User.create({
    name,
    email,
    phoneNumber,
    role,
    password,
    passwordConfirm,
    photo: req.body.photo,
  });
  newUser.password = undefined;

  // Send welcome email
  try {
    await new Email(newUser).sendEmail('welcome', {
      subject: 'Welcome to Betoch!',
    });
  } catch (err) {
    console.error('Welcome email failed:', err);
  }

  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  //check if email/password are in the requested body
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('please provide email or password', 400));

  //check if a user exists and the password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Invalid email or password', 401));

  //create a token and send it to the user ,if every thing is ok
  createSendToken(user, 200, res);
});
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 100 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
});
exports.protect = catchAsync(async (req, res, next) => {
  //1)getting the token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('you are not logged in ,please log in to get access', 401));
  }

  //2) verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) check if a user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('The user belonging to this Token no longer exist.', 401));

  //4) check if currentUser changed the password after the token issued
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(new AppError('currentUser recently changed password,please login again!', 401));

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt) return next();

  try {
    // verification of the token
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

    //3) check if a user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next();

    //4) check if currentUser changed the password after the token issued
    if (currentUser.changedPasswordAfter(decoded.iat)) return next();
    res.locals.user = currentUser;
    req.user = currentUser;
    return next();
  } catch (err) {
    return next();
  }
});
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("you don't have the permission to perform this action!", 403));
    next();
  };
exports.forgetPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('there is no user with this email address', 404));
  // generate random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
  try {
    await new Email(user).sendEmail('password-reset', {
      subject: 'Reset your password - Betoch',
      resetUrl,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(new AppError('there was an error sending the email, Try again later!', 500));
  }
  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  if (!req.params.resetToken) return next(new AppError('No reset token provided', 400));
  const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) return next(new AppError('An invalid or expired token,try again later.', 404));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) return next(new AppError('User not found', 404));
  if (!req.body.password || !req.body.passwordConfirm || !req.body.passwordCurrent)
    return next(new AppError('Please provide current password, new password and passwordConfirm', 400));

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Incorrect password, try again!', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});
