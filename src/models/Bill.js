const mongoose = require('mongoose');
const moment = require('moment');

const billSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Not Paid'],
    default: 'Not Paid'
  },
  dispatchDate: {
    type: Date,
    default: Date.now
  },
  paymentDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Virtual for formatted dates
billSchema.virtual('formattedDispatchDate').get(function() {
  return moment(this.dispatchDate).format('MMMM Do YYYY, h:mm:ss a');
});

billSchema.virtual('formattedPaymentDate').get(function() {
  return this.paymentDate ? moment(this.paymentDate).format('MMMM Do YYYY, h:mm:ss a') : '';
});

module.exports = mongoose.model('Bill', billSchema);