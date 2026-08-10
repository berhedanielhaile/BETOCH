const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
    },
    phone: String,
    type: {
      type: String,
      enum: ['message', 'viewing_request'],
      default: 'message',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
    contactPreference: {
      type: String,
      enum: ['phone', 'telegram', 'whatsapp'],
      default: 'phone',
    },
    contactValue: String,
    respondedAt: Date,
    message: {
      type: String,
      required: [true, 'Message cannot be empty'],
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property',
      required: [true, 'Enquiry must belong to a property'],
    },
    landlord: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

enquirySchema.index({ property: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
