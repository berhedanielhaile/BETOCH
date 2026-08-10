const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'User must have an email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^\S+@\S+\.\S+$/.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      validate: {
        validator: function (phone) {
          return /^\+251\d{9}$/.test(phone);
        },
        message: 'Phone number must start with +251 followed by 9 digits',
      },
    },
    role: {
      type: String,
      enum: ['tenant', 'landlord', 'admin'],
      default: 'tenant',
    },
    password: {
      type: String,
      required: [true, 'User must have a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    photo: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    address: {
      city: String,
      subcity: String,
      woreda: String,
      kebele: String,
      zipCode: {
        type: String,
        default: '1000',
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
    verificationToken: String,
    favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Property',
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Property',
      },
    ],
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.pre(/^find/, function () {
  this.select('name email role phoneNumber');
});
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = new Date(Date.now() - 1000);
});
userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = await crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetToken = hashedToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
