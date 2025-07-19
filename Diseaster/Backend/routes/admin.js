// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/user');

// GET /api/admin/volunteers – Only admin can see volunteers
router.get('/volunteers', auth, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Only admin can view volunteers' });

  try {
    const volunteers = await User.find({ role: 'volunteer' }).select('name email location');
    res.json(volunteers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
});

module.exports = router;
