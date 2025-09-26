const express = require('express');
const { getDB } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Apply authentication and student authorization to all routes
router.use(authenticate);
router.use(authorize('student'));

// Get student profile
router.get('/profile', async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection('users');

    const student = await users.findOne({ _id: new ObjectId(req.user.userId) });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update student profile
router.put('/profile', async (req, res) => {
  try {
    const { fieldOfStudy, degreeNote, expectedGraduation, files } = req.body;

    const db = getDB();
    const users = db.collection('users');

    const updateData = {
      fieldOfStudy,
      degreeNote,
      expectedGraduation: expectedGraduation ? new Date(expectedGraduation) : null,
      files: files || {},
      updatedAt: new Date(),
    };

    await users.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $set: updateData }
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;