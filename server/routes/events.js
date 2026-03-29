const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'name')
      .populate('createdBy', 'name');
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events
// @desc    Create new event
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, category, date, location, bannerImage, maxAttendees } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      category,
      date,
      location,
      bannerImage,
      maxAttendees,
      createdBy: req.user.id
    });

    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/events/:id
// @desc    Edit event
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, category, date, location, bannerImage, maxAttendees } = req.body;

  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Make sure user owns event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, category, date, location, bannerImage, maxAttendees },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Make sure user owns event
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await event.deleteOne();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/events/:id/rsvp
// @desc    RSVP to an event
// @access  Private
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Check if user already RSVPed
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already RSVPed to this event' });
    }

    // Check capacity
    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ msg: 'Event is at maximum capacity' });
    }

    event.attendees.push(req.user.id);
    await event.save();
    
    // Return updated attendees list populated with user data if needed,
    // or simply just a success message
    res.json({ msg: 'RSVP successful', attendees: event.attendees });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/events/:id/rsvp
// @desc    Cancel RSVP
// @access  Private
router.delete('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Check if user actually RSVPed
    const removeIndex = event.attendees.indexOf(req.user.id);
    if (removeIndex === -1) {
      return res.status(400).json({ msg: 'Not RSVPed to this event' });
    }

    event.attendees.splice(removeIndex, 1);
    await event.save();
    res.json({ msg: 'RSVP cancelled', attendees: event.attendees });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
