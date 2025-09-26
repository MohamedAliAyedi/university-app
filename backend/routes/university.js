const express = require('express');
const { getDB } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Apply authentication and university authorization to all routes
router.use(authenticate);
router.use(authorize('university'));

// Get university profile
router.get('/profile', async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection('users');

    const university = await users.findOne({ _id: new ObjectId(req.user.userId) });
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    res.json({ university });
  } catch (error) {
    console.error('Error fetching university profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get university offers
router.get('/offers', async (req, res) => {
  try {
    const db = getDB();
    const offers = db.collection('offers');

    const universityOffers = await offers
      .find({ universityId: req.user.userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ offers: universityOffers });
  } catch (error) {
    console.error('Error fetching university offers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new offer
router.post('/offers', async (req, res) => {
  try {
    const {
      title,
      description,
      fieldOfStudy,
      degree,
      numberOfSpots,
      requirements,
      deadline,
      startDate,
      duration,
      language,
      tuitionFee,
      scholarship
    } = req.body;

    const db = getDB();
    const users = db.collection('users');
    const offers = db.collection('offers');

    // Get university info
    const university = await users.findOne({ _id: new ObjectId(req.user.userId) });
    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    const newOffer = {
      title,
      description,
      universityId: req.user.userId,
      universityName: university.universityName,
      country: university.country,
      fieldOfStudy,
      degree,
      numberOfSpots,
      requirements: requirements || [],
      deadline: new Date(deadline),
      startDate: new Date(startDate),
      duration,
      language,
      tuitionFee: tuitionFee || null,
      scholarship: scholarship || false,
      applications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    const result = await offers.insertOne(newOffer);

    // Update university's offers array
    await users.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $push: { offers: result.insertedId.toString() } }
    );

    res.status(201).json({
      message: 'Offer created successfully',
      offerId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;