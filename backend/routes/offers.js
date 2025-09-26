const express = require('express');
const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Get all active offers (public endpoint)
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const offers = db.collection('offers');

    const allOffers = await offers
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ offers: allOffers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Get specific offer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid offer ID' });
    }

    const db = getDB();
    const offers = db.collection('offers');

    const offer = await offers.findOne({ _id: new ObjectId(id) });
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json({ offer });
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;