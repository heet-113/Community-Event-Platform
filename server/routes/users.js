const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Event = require('../models/Event');

// @route   GET api/users/me
// @desc    Get logged-in user's profile + their events
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const createdEvents = await Event.find({ createdBy: req.user.id }).sort({ date: 1 });
    const rsvpEvents = await Event.find({ attendees: req.user.id }).sort({ date: 1 });

    res.json({
      user,
      createdEvents,
      rsvpEvents
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
