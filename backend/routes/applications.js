const express = require('express');
const { getDB } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Submit application (students only)
router.post('/', authorize('student'), async (req, res) => {
  try {
    const { offerId } = req.body;

    const db = getDB();
    const users = db.collection('users');
    const offers = db.collection('offers');

    // Get student info
    const student = await users.findOne({ _id: new ObjectId(req.user.userId) });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if already applied
    if (student.applications?.includes(offerId)) {
      return res.status(400).json({ error: 'Already applied to this offer' });
    }

    // Get offer info
    const offer = await offers.findOne({ _id: new ObjectId(offerId) });
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Create application
    const application = {
      _id: new ObjectId(),
      studentId: req.user.userId,
      offerId,
      status: 'pending',
      appliedAt: new Date(),
      studentInfo: {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        espritId: student.espritId,
        fieldOfStudy: student.fieldOfStudy,
        degreeNote: student.degreeNote,
      },
      recommendations: [],
    };

    // Update offer with application
    await offers.updateOne(
      { _id: new ObjectId(offerId) },
      { $push: { applications: application } }
    );

    // Update student with application
    await users.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $push: { applications: offerId } }
    );

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student applications
router.get('/', authorize('student'), async (req, res) => {
  try {
    const db = getDB();
    const offers = db.collection('offers');

    // Get all offers with applications from this student
    const studentApplications = await offers
      .find({
        'applications.studentId': req.user.userId
      })
      .toArray();

    const applications = [];
    for (const offer of studentApplications) {
      const application = offer.applications.find(app => app.studentId === req.user.userId);
      if (application) {
        applications.push({
          ...application,
          offerTitle: offer.title,
          universityName: offer.universityName,
          country: offer.country,
        });
      }
    }

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;