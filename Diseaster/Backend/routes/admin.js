const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // adjust path if needed
const User = require('../models/user');
const Request = require('../models/request');

// ✅ GET /api/admin/volunteers
// Admin can see list of volunteers
router.get('/volunteers', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Only admin can view volunteers' });

  try {
    const volunteers = await User.find({ role: 'volunteer' });
    res.json(volunteers);
  } catch (err) {
    console.error('Error fetching volunteers:', err);
    res.status(500).json({ message: 'Failed to fetch volunteers' });
  }
});

// ✅ PUT /api/admin/assign/:requestId
// Assign a volunteer to a help request
router.put('/assign/:requestId', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Only admin can assign volunteers' });

  const { volunteerId } = req.body;

  try {
    const updated = await Request.findByIdAndUpdate(
      req.params.requestId,
      { assignedVolunteer: volunteerId, status: 'assigned' },
      { new: true }
    ).populate('assignedVolunteer', 'name email location');

    res.json(updated);
  } catch (err) {
    console.error('Error assigning volunteer:', err);
    res.status(500).json({ message: 'Failed to assign volunteer' });
  }
});

// ✅ GET /api/requests/stats
// Admin dashboard stats
router.get('/stats', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Only admin can view stats' });

  try {
    const total = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: 'pending' });
    const completed = await Request.countDocuments({ status: 'completed' });

    res.json({ total, pending, completed });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ message: 'Failed to get stats' });
  }
});

module.exports = router;
