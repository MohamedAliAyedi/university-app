const express = require('express');
const { getDB } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Apply authentication and teacher authorization to all routes
router.use(authenticate);
router.use(authorize('teacher'));

// Get teacher profile
router.get('/profile', async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection('users');

    const teacher = await users.findOne({ _id: new ObjectId(req.user.userId) });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({ teacher });
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get students
router.get('/students', async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection('users');

    const students = await users
      .find({ role: 'student', isActive: true })
      .project({
        firstName: 1,
        lastName: 1,
        espritId: 1,
        fieldOfStudy: 1,
        degreeNote: 1,
        applications: 1,
      })
      .sort({ firstName: 1 })
      .toArray();

    res.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;