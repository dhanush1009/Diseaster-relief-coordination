const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Request = require('../models/Request');
const User = require('../models/user');

/**
 * -------------------------------------
 * Victim: Create new request
 * -------------------------------------
 */
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'victim') {
    return res.status(403).json({ message: 'Only victims can create requests' });
  }

  const { type, location, description } = req.body;
  if (!type || !location || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newRequest = new Request({
      user: req.user.id,
      type,
      location,
      description
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create request' });
  }
});


/**
 * -------------------------------------
 * Admin: View all requests
 * -------------------------------------
 */
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can view requests' });
  }

  try {
    const requests = await Request.find()
      .populate('user', 'name email')
      .populate('assignedVolunteer', 'name email');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});


/**
 * -------------------------------------
 * Admin: Delete a request by ID
 * -------------------------------------
 */
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can delete requests' });
  }

  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete request' });
  }
});


/**
 * -------------------------------------
 * Admin: Assign volunteer to a request
 * -------------------------------------
 */
router.put('/:id/assign', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can assign' });
  }

  const { volunteerId } = req.body;
  try {
    const volunteer = await User.findOne({ _id: volunteerId, role: 'volunteer' });
    if (!volunteer) {
      return res.status(400).json({ message: 'Invalid volunteer' });
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { assignedVolunteer: volunteerId },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to assign volunteer' });
  }
});


/**
 * -------------------------------------
 * Admin: View request statistics
 * -------------------------------------
 */
router.get('/stats', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can view stats' });
  }

  try {
    const total = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: 'pending' });
    const completed = await Request.countDocuments({ status: 'completed' });
    res.json({ total, pending, completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get stats' });
  }
});


/**
 * -------------------------------------
 * Volunteer: View assigned requests
 * -------------------------------------
 */
router.get('/assigned', auth, async (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can view assigned requests' });
  }

  try {
    const assigned = await Request.find({ assignedVolunteer: req.user.id })
      .populate('user', 'name email');
    res.json(assigned);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching assigned requests' });
  }
});


/**
 * -------------------------------------
 * Volunteer: Update request status
 * -------------------------------------
 */
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can update status' });
  }

  const { status } = req.body;
  try {
    const updated = await Request.findOneAndUpdate(
      { _id: req.params.id, assignedVolunteer: req.user.id },
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Update failed' });
  }
});

module.exports = router;
