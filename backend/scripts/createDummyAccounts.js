const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/esprit_university';

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const dummyAccounts = [
  // Admin accounts
  {
    email: 'admin@esprit.tn',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    phoneNumber: '+216 71 123 456',
    role: 'admin',
    isActive: true,
    permissions: ['all'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Student accounts
  {
    email: 'ahmed.ben.ali@esprit.tn',
    password: 'student123',
    firstName: 'Ahmed',
    lastName: 'Ben Ali',
    phoneNumber: '+216 20 123 456',
    role: 'student',
    espritId: 'ESP001234',
    emailEsprit: 'ahmed.benali@esprit.tn',
    fieldOfStudy: 'Computer Science',
    degreeNote: 16.5,
    expectedGraduation: new Date('2024-06-30'),
    isActive: true,
    applications: [],
    files: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'fatma.trabelsi@esprit.tn',
    password: 'student123',
    firstName: 'Fatma',
    lastName: 'Trabelsi',
    phoneNumber: '+216 22 234 567',
    role: 'student',
    espritId: 'ESP001235',
    emailEsprit: 'fatma.trabelsi@esprit.tn',
    fieldOfStudy: 'Software Engineering',
    degreeNote: 17.2,
    expectedGraduation: new Date('2024-06-30'),
    isActive: true,
    applications: [],
    files: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'mohamed.gharbi@esprit.tn',
    password: 'student123',
    firstName: 'Mohamed',
    lastName: 'Gharbi',
    phoneNumber: '+216 23 345 678',
    role: 'student',
    espritId: 'ESP001236',
    emailEsprit: 'mohamed.gharbi@esprit.tn',
    fieldOfStudy: 'Business Administration',
    degreeNote: 15.8,
    expectedGraduation: new Date('2025-06-30'),
    isActive: true,
    applications: [],
    files: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // Teacher accounts
  {
    email: 'prof.smith@esprit.tn',
    password: 'teacher123',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumber: '+216 71 456 789',
    role: 'teacher',
    department: 'Computer Science',
    isDepartmentHead: true,
    recommendations: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'prof.martin@esprit.tn',
    password: 'teacher123',
    firstName: 'Marie',
    lastName: 'Martin',
    phoneNumber: '+216 71 567 890',
    role: 'teacher',
    department: 'Business Administration',
    isDepartmentHead: false,
    recommendations: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  
  // University accounts
  {
    email: 'contact@sorbonne.fr',
    password: 'university123',
    firstName: 'International',
    lastName: 'Office',
    phoneNumber: '+33 1 40 46 22 11',
    role: 'university',
    universityName: 'Sorbonne University',
    country: 'France',
    website: 'https://www.sorbonne-universite.fr',
    description: 'A world-class multidisciplinary research university',
    offers: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'admissions@tum.de',
    password: 'university123',
    firstName: 'Admissions',
    lastName: 'Office',
    phoneNumber: '+49 89 289 01',
    role: 'university',
    universityName: 'Technical University of Munich',
    country: 'Germany',
    website: 'https://www.tum.de',
    description: 'One of Europe\'s top universities for technology and innovation',
    offers: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'international@mit.edu',
    password: 'university123',
    firstName: 'International',
    lastName: 'Programs',
    phoneNumber: '+1 617 253 1000',
    role: 'university',
    universityName: 'Massachusetts Institute of Technology',
    country: 'United States',
    website: 'https://www.mit.edu',
    description: 'A world-renowned institute of technology and research',
    offers: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const dummyOffers = [
  {
    title: 'Master\'s in Artificial Intelligence',
    description: 'A comprehensive program covering machine learning, deep learning, and AI applications in various domains.',
    universityId: '', // Will be filled with Sorbonne ID
    universityName: 'Sorbonne University',
    country: 'France',
    fieldOfStudy: 'Computer Science',
    degree: 'Master\'s',
    numberOfSpots: 15,
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Minimum GPA of 3.0',
      'French or English proficiency',
      'CV and motivation letter',
      'Two recommendation letters'
    ],
    deadline: new Date('2024-05-15'),
    startDate: new Date('2024-09-01'),
    duration: '2 years',
    language: 'English',
    tuitionFee: 12000,
    scholarship: true,
    applications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    title: 'PhD in Mechanical Engineering',
    description: 'Research-focused doctoral program in advanced mechanical engineering topics.',
    universityId: '', // Will be filled with TUM ID
    universityName: 'Technical University of Munich',
    country: 'Germany',
    fieldOfStudy: 'Mechanical Engineering',
    degree: 'PhD',
    numberOfSpots: 5,
    requirements: [
      'Master\'s degree in Mechanical Engineering',
      'Research proposal',
      'German or English proficiency',
      'Academic transcripts',
      'Three recommendation letters'
    ],
    deadline: new Date('2024-04-30'),
    startDate: new Date('2024-10-01'),
    duration: '3-4 years',
    language: 'English',
    tuitionFee: null,
    scholarship: true,
    applications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    title: 'Exchange Program in Business',
    description: 'One semester exchange program for business students.',
    universityId: '', // Will be filled with MIT ID
    universityName: 'Massachusetts Institute of Technology',
    country: 'United States',
    fieldOfStudy: 'Business Administration',
    degree: 'Exchange',
    numberOfSpots: 8,
    requirements: [
      'Currently enrolled in business program',
      'Minimum GPA of 3.5',
      'English proficiency (TOEFL/IELTS)',
      'Academic transcripts',
      'One recommendation letter'
    ],
    deadline: new Date('2024-03-31'),
    startDate: new Date('2024-08-15'),
    duration: '1 semester',
    language: 'English',
    tuitionFee: 25000,
    scholarship: false,
    applications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  }
];

async function createDummyAccounts() {
  let client;
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('esprit_university');
    const users = db.collection('users');
    const offers = db.collection('offers');
    
    console.log('🗑️  Clearing existing data...');
    await users.deleteMany({});
    await offers.deleteMany({});
    
    console.log('🔐 Hashing passwords...');
    for (let account of dummyAccounts) {
      account.password = await hashPassword(account.password);
    }
    
    console.log('👥 Creating user accounts...');
    const userResult = await users.insertMany(dummyAccounts);
    console.log(`✅ Created ${userResult.insertedCount} user accounts`);
    
    // Get university IDs for offers
    const sorbonne = await users.findOne({ universityName: 'Sorbonne University' });
    const tum = await users.findOne({ universityName: 'Technical University of Munich' });
    const mit = await users.findOne({ universityName: 'Massachusetts Institute of Technology' });
    
    // Update offers with university IDs
    dummyOffers[0].universityId = sorbonne._id.toString();
    dummyOffers[1].universityId = tum._id.toString();
    dummyOffers[2].universityId = mit._id.toString();
    
    console.log('📚 Creating study offers...');
    const offerResult = await offers.insertMany(dummyOffers);
    console.log(`✅ Created ${offerResult.insertedCount} study offers`);
    
    // Update universities with their offer IDs
    await users.updateOne(
      { _id: sorbonne._id },
      { $push: { offers: offerResult.insertedIds[0].toString() } }
    );
    await users.updateOne(
      { _id: tum._id },
      { $push: { offers: offerResult.insertedIds[1].toString() } }
    );
    await users.updateOne(
      { _id: mit._id },
      { $push: { offers: offerResult.insertedIds[2].toString() } }
    );
    
    console.log('\n🎉 Dummy data created successfully!');
    console.log('\n📋 Account Summary:');
    console.log('==================');
    console.log('👤 Admin Account:');
    console.log('   Email: admin@esprit.tn');
    console.log('   Password: admin123');
    console.log('\n🎓 Student Accounts:');
    console.log('   Email: ahmed.ben.ali@esprit.tn | Password: student123');
    console.log('   Email: fatma.trabelsi@esprit.tn | Password: student123');
    console.log('   Email: mohamed.gharbi@esprit.tn | Password: student123');
    console.log('\n👨‍🏫 Teacher Accounts:');
    console.log('   Email: prof.smith@esprit.tn | Password: teacher123');
    console.log('   Email: prof.martin@esprit.tn | Password: teacher123');
    console.log('\n🏛️  University Accounts:');
    console.log('   Email: contact@sorbonne.fr | Password: university123');
    console.log('   Email: admissions@tum.de | Password: university123');
    console.log('   Email: international@mit.edu | Password: university123');
    console.log('\n📊 Statistics:');
    console.log(`   Total Users: ${userResult.insertedCount}`);
    console.log(`   Total Offers: ${offerResult.insertedCount}`);
    
  } catch (error) {
    console.error('❌ Error creating dummy accounts:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n📴 Database connection closed');
    }
  }
}

// Run the script
if (require.main === module) {
  createDummyAccounts();
}

module.exports = { createDummyAccounts };