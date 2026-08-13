const Property = require('../models/property-model');
const Enquiry = require('../models/enquiry-model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getHomePage = catchAsync(async (req, res, next) => {
  const properties = await Property.find();
  if (!properties || properties.length === 0) return next(new AppError('No properties found', 404));
  res.status(200).render('homepage', {
    title: 'Rent Direct, Save More | No Middleman, No Brokerage Fees',
    properties,
  });
});
exports.getPropertyListings = catchAsync(async (req, res, next) => {
  const properties = await Property.find();
  if (!properties || properties.length === 0) return next(new AppError('No properties found', 404));
  res.status(200).render('property-listings', {
    title: 'Browse Properties',
    properties,
  });
});
exports.getPropertyDetails = catchAsync(async (req, res, next) => {
  const property = await Property.findOne({ slug: req.params.slug }).populate('landlord');
  if (!property) return next(new AppError('Property not found', 404));

  let enquiry = null;
  if (req.user && req.user.role !== 'landlord') {
    enquiry = await Enquiry.findOne({ property: property._id, user: req.user._id }).sort({ createdAt: -1 });
  }

  res.status(200).render('property-detail', {
    title: property.title,
    property,
    enquiry,
  });
});
exports.showloginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};
exports.showsignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'signup',
  });
};
exports.showUserDashboard = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError('You must be logged in to view the dashboard', 401));

  const userId = req.user._id;
  const role = req.user.role || 'user';
  let properties = [];
  let stats = {};
  let activeListings = 0;
  let totalViews = 0;
  let newListings = 0;
  let newEnquiries = 0;
  let enquiries = [];

  if (role === 'landlord') {
    properties = await Property.find({ landlord: userId });

    const agg = await Property.aggregate([
      { $match: { landlord: userId } },
      {
        $group: {
          _id: '$id',
          numProperties: { $sum: 1 },
          views: { $sum: '$views' },
        },
      },
    ]);

    const statuses = ['pending', 'approved', 'rejected', 'rented'];
    stats = statuses.reduce((acc, s) => {
      const found = agg.find((a) => a._id === s);
      acc[s] = found ? found.numProperties : 0;
      return acc;
    }, {});

    totalViews = agg.reduce((sum, a) => sum + (a.views || 0), 0);

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    newListings = await Property.countDocuments({ landlord: userId, createdAt: { $gte: since } });

    newEnquiries = await Enquiry.countDocuments({ landlord: userId, createdAt: { $gte: since } });
    enquiries = await Enquiry.find({ landlord: userId }).populate('property user').sort({ createdAt: -1 });

    activeListings = properties.filter((p) => p.status === 'approved').length;
  } else {
    enquiries = await Enquiry.find({ user: userId }).populate('property').sort({ createdAt: -1 });
    newEnquiries = enquiries.filter((enq) => enq.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  }

  res.status(200).render('dashboard', {
    title: 'user dashboard',
    role,
    stats,
    properties,
    activeListings,
    totalViews,
    newListings,
    newEnquiries,
    enquiries,
  });
});
exports.showPostlistingForm = (req, res, next) => {
  if (!req.user) return next(new AppError('You must be logged in to post your listings', 401));
  res.status(200).render('post-listing', {
    title: 'Post your property',
  });
};

exports.showMyListings = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError('You must be logged in to view your listings', 401));
  const userId = req.user._id;
  const properties = await Property.find({ landlord: userId });
  res.status(200).render('my-listings', {
    title: 'My listings',
    properties,
  });
});

exports.showEnquiriesPage = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError('You must be logged in to view enquiries', 401));
  const userId = req.user._id;

  if (req.user.role !== 'landlord') {
    return res.redirect('/dashboard');
  }

  const enquiries = await Enquiry.find({ landlord: userId }).populate('property user').sort({ createdAt: -1 });

  res.status(200).render('enquiries', {
    title: 'Enquiries',
    enquiries,
    role: req.user.role,
  });
});

exports.showAccountSettings = (req, res, next) => {
  if (!req.user) return next(new AppError('You must be logged in to view account settings', 401));
  res.status(200).render('account-settings', {
    title: 'Account settings',
    user: req.user,
  });
};
