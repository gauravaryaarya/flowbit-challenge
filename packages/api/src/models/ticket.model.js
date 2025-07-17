const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Processing', 'Done'],
    default: 'Open',
  },

  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);