const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  location: {
    city: { type: String, required: true },
    address: { type: String, required: true }
  },
  bannerImage: { type: String, default: '' },
  maxAttendees: { type: Number, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
