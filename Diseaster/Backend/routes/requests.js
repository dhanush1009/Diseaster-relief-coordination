const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Request = require('../models/Request');
const User = require('../models/user');

// Create request (victim)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'victim')
    return res.status(403).json({ message: 'Only victims can create requests' });

  const { description, location, type } = req.body;
  try {
    const newReq = new Request({ user: req.user.id, description, location, type });
    await newReq.save();
    res.status(201).json(newReq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create request' });
  }
});

// View all requests (admin)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Only admin can view all requests' });

  try {
    const all = await Request.find().populate('user', 'name email').populate('assignedVolunteer', 'name email');
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Get stats (admin)
router.get('/stats', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Only admin can view stats' });

  try {
    const total = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: 'pending' });
    const completed = await Request.countDocuments({ status: 'completed' });
    res.json({ total, pending, completed });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get stats' });
  }
});

// Assign volunteer (admin)
router.put('/:id/assign', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Only admin can assign' });

  const { volunteerId } = req.body;
  try {
    const volunteer = await User.findOne({ _id: volunteerId, role: 'volunteer' });
    if (!volunteer)
      return res.status(400).json({ message: 'Invalid volunteer' });

    const updated = await Request.findByIdAndUpdate(req.params.id, { assignedVolunteer: volunteerId }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign volunteer' });
  }
});

// Get assigned requests (volunteer)
router.get('/assigned', auth, async (req, res) => {
  if (req.user.role !== 'volunteer')
    return res.status(403).json({ message: 'Only volunteers' });

  try {
    const assigned = await Request.find({ assignedVolunteer: req.user.id }).populate('user', 'name email');
    res.json(assigned);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assigned requests' });
  }
});

// Update status (volunteer)
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'volunteer')
    return res.status(403).json({ message: 'Only volunteers' });

  const { status } = req.body;
  try {
    const updated = await Request.findOneAndUpdate(
      { _id: req.params.id, assignedVolunteer: req.user.id },
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
});
module.exports = router;
