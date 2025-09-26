const { MongoClient } = require('mongodb');

let client;
let db;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db('esprit_university');
    
    console.log('✅ Connected to MongoDB');
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ espritId: 1 }, { sparse: true, unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ isActive: 1 });
    
    // Offers collection indexes
    await db.collection('offers').createIndex({ universityId: 1 });
    await db.collection('offers').createIndex({ isActive: 1 });
    await db.collection('offers').createIndex({ deadline: 1 });
    await db.collection('offers').createIndex({ country: 1 });
    await db.collection('offers').createIndex({ fieldOfStudy: 1 });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('📴 MongoDB connection closed');
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB
};