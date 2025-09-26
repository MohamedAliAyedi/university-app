const express = require('express');
const { getDB } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Create recommendation (teachers only)
router.post('/', authorize('teacher'), async (req, res) => {
  try {
    const { studentId, offerId, message, rating } = req.body;

    const db = getDB();
    const users = db.collection('users');
    const offers = db.collection('offers');

    // Get teacher info
    const teacher = await users.findOne({ _id: new ObjectId(req.user.userId) });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Get student info
    const student = await users.findOne({ _id: new ObjectId(studentId) });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get offer info
    const offer = await offers.findOne({ _id: new ObjectId(offerId) });
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Find the student's application in the offer
    const applicationIndex = offer.applications.findIndex(
      app => app.studentId === studentId
    );

    if (applicationIndex === -1) {
      return res.status(404).json({ error: 'Student application not found for this offer' });
    }

    // Create recommendation
    const recommendation = {
      _id: new ObjectId(),
      teacherId: req.user.userId,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      department: teacher.department,
      message,
      rating: Math.min(Math.max(rating, 1), 5), // Ensure rating is between 1-5
      createdAt: new Date(),
    };

    // Add recommendation to the application
    await offers.updateOne(
      { 
        _id: new ObjectId(offerId),
        'applications.studentId': studentId
      },
      { 
        $push: { 'applications.$.recommendations': recommendation }
      }
    );

    // Add recommendation to teacher's record
    await users.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { 
        $push: { 
          recommendations: {
            studentId,
            offerId,
            recommendationId: recommendation._id,
            createdAt: new Date()
          }
        }
      }
    );

    res.status(201).json({
      message: 'Recommendation created successfully',
      recommendation
    });
  } catch (error) {
    console.error('Error creating recommendation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recommendations for a student (teachers and admins)
router.get('/:studentId', authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { studentId } = req.params;

    const db = getDB();
    const offers = db.collection('offers');

    // Find all offers where this student has applications with recommendations
    const offersWithRecommendations = await offers
      .find({
        'applications.studentId': studentId,
        'applications.recommendations': { $exists: true, $ne: [] }
      })
      .toArray();

    const recommendations = [];
    for (const offer of offersWithRecommendations) {
      const application = offer.applications.find(app => app.studentId === studentId);
      if (application && application.recommendations) {
        for (const rec of application.recommendations) {
          recommendations.push({
            ...rec,
            offerTitle: offer.title,
            universityName: offer.universityName,
            country: offer.country
          });
        }
      }
    }

    res.json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;