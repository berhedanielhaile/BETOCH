const Enquiry = require('../models/enquiry-model');
const Property = require('../models/property-model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { deleteOne, getOne } = require('./handler-factory');

exports.setPropertyUserIds = (req, res, next) => {
  if (!req.body.property && req.params.propertyId) req.body.property = req.params.propertyId;
  if (!req.body.user && req.user) req.body.user = req.user._id;
  next();
};

exports.createEnquiry = catchAsync(async (req, res, next) => {
  if (!req.body.property) return next(new AppError('Enquiry must belong to a property', 400));

  if (!req.user || req.user.role === 'landlord') {
    return next(new AppError('Only tenants can send viewing requests', 403));
  }

  const property = await Property.findById(req.body.property);
  if (!property) return next(new AppError('The property could not be found', 404));

  const existingRequest = await Enquiry.findOne({
    property: property._id,
    user: req.user._id || req.user,
  });

  if (existingRequest) {
    return next(new AppError('You have already sent an enquiry for this property. You can only send one enquiry per property.', 409));
  }

  const doc = await Enquiry.create({
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
    phone: req.body.phone || req.user.phoneNumber || req.user.phone,
    message: req.body.message,
    type: req.body.type || 'message',
    status: 'pending',
    property: property._id,
    landlord: property.landlord,
    user: req.body.user || req.user._id || req.user,
  });
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.respondToEnquiry = catchAsync(async (req, res, next) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return next(new AppError('There is no enquiry with this id', 404));

  if (req.user.role !== 'landlord' && req.user.role !== 'admin') {
    return next(new AppError('You are not allowed to respond to this enquiry', 403));
  }

  const ownerId = enquiry.landlord ? enquiry.landlord.toString() : null;
  const currentUserId = req.user._id ? req.user._id.toString() : req.user.toString();

  if (ownerId && ownerId !== currentUserId && req.user.role !== 'admin') {
    return next(new AppError('You can only respond to enquiries for your own property', 403));
  }

  if (req.body.action === 'decline') {
    enquiry.status = 'declined';
  } else {
    enquiry.status = 'accepted';
    enquiry.contactPreference = req.body.contactPreference || 'phone';
    enquiry.contactValue = req.body.contactValue || req.user.phoneNumber || req.user.phone || '';
  }

  enquiry.respondedAt = new Date();
  await enquiry.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: enquiry,
    },
  });
});

exports.getAllEnquiries = catchAsync(async (req, res, next) => {
  const filter = {};

  if (req.user.role === 'landlord' && req.user._id) {
    filter.landlord = req.user._id;
  }

  const enquiries = await Enquiry.find(filter).populate('property user').sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: enquiries.length,
    data: {
      data: enquiries,
    },
  });
});

exports.getMyEnquiryForProperty = catchAsync(async (req, res, next) => {
  if (!req.user || req.user.role === 'landlord') {
    return res.status(200).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  }

  const enquiry = await Enquiry.findOne({
    property: req.params.propertyId,
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    data: {
      data: enquiry,
    },
  });
});

exports.getEnquiry = getOne(Enquiry);
exports.deleteEnquiry = deleteOne(Enquiry);
