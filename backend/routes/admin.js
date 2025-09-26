const express = require('express');
const { getDB } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { ObjectId } = require('mongodb');
const XLSX = require('xlsx');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('admin'));

// Get admin stats
router.get('/stats', async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection('users');
    const offers = db.collection('offers');

    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalUniversities,
      totalOffers,
      pendingActivations
    ] = await Promise.all([
      users.countDocuments(),
      users.countDocuments({ role: 'student' }),
      users.countDocuments({ role: 'teacher' }),
      users.countDocuments({ role: 'university' }),
      offers.countDocuments(),
      users.countDocuments({ isActive: false, role: { $ne: 'admin' } })
    ]);

    // Count total applications
    const offersWithApplications = await offers.find({}).toArray();
    const totalApplications = offersWithApplications.reduce(
      (sum, offer) => sum + (offer.applications?.length || 0), 
      0
    );

    const stats = {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalUniversities,
      totalOffers,
      totalApplications,
      pendingActivations,
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection('users');

    const allUsers = await users
      .find({})
      .project({
        firstName: 1,
        lastName: 1,
        email: 1,
        role: 1,
        isActive: 1,
        createdAt: 1,
        universityName: 1,
        department: 1,
        espritId: 1,
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ users: allUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle user status
router.post('/users/toggle-status', async (req, res) => {
  try {
    const { userId, isActive } = req.body;

    const db = getDB();
    const users = db.collection('users');

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          isActive,
          updatedAt: new Date()
        }
      }
    );

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send activation email
router.post('/send-activation-email', async (req, res) => {
  try {
    const { userId } = req.body;

    const db = getDB();
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // TODO: Implement email sending logic here
    console.log(`Sending activation email to ${user.email}`);

    res.json({ message: 'Activation email sent successfully' });
  } catch (error) {
    console.error('Error sending activation email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export data
router.get('/export', async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection('users');
    const offers = db.collection('offers');

    // Get all data
    const [allUsers, allOffers] = await Promise.all([
      users.find({}).toArray(),
      offers.find({}).toArray()
    ]);

    // Prepare users data
    const usersData = allUsers.map(user => ({
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Email': user.email,
      'Role': user.role,
      'Status': user.isActive ? 'Active' : 'Inactive',
      'Created At': new Date(user.createdAt).toLocaleDateString(),
      'Esprit ID': user.espritId || '',
      'University': user.universityName || '',
      'Department': user.department || '',
      'Country': user.country || '',
    }));

    // Prepare offers data
    const offersData = allOffers.map(offer => ({
      'Title': offer.title,
      'University': offer.universityName,
      'Country': offer.country,
      'Field of Study': offer.fieldOfStudy,
      'Degree': offer.degree,
      'Spots': offer.numberOfSpots,
      'Applications': offer.applications?.length || 0,
      'Deadline': new Date(offer.deadline).toLocaleDateString(),
      'Start Date': new Date(offer.startDate).toLocaleDateString(),
      'Status': offer.isActive ? 'Active' : 'Inactive',
      'Created At': new Date(offer.createdAt).toLocaleDateString(),
    }));

    // Prepare applications data
    const applicationsData = [];
    for (const offer of allOffers) {
      if (offer.applications && offer.applications.length > 0) {
        for (const app of offer.applications) {
          applicationsData.push({
            'Student Name': `${app.studentInfo.firstName} ${app.studentInfo.lastName}`,
            'Student Email': app.studentInfo.email,
            'Esprit ID': app.studentInfo.espritId,
            'Offer Title': offer.title,
            'University': offer.universityName,
            'Country': offer.country,
            'Status': app.status,
            'Applied At': new Date(app.appliedAt).toLocaleDateString(),
            'Recommendations': app.recommendations?.length || 0,
          });
        }
      }
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Add worksheets
    const usersWorksheet = XLSX.utils.json_to_sheet(usersData);
    const offersWorksheet = XLSX.utils.json_to_sheet(offersData);
    const applicationsWorksheet = XLSX.utils.json_to_sheet(applicationsData);
    
    XLSX.utils.book_append_sheet(workbook, usersWorksheet, 'Users');
    XLSX.utils.book_append_sheet(workbook, offersWorksheet, 'Offers');
    XLSX.utils.book_append_sheet(workbook, applicationsWorksheet, 'Applications');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="esprit-university-data-${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create account
router.post('/create-account', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role,
      // Student specific
      espritId,
      emailEsprit,
      // Teacher specific
      department,
      // University specific
      universityName,
      country,
      website,
      description,
    } = req.body;

    const db = getDB();
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user object based on role
    let userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role,
      isActive: true, // Admin-created accounts are active by default
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add role-specific fields
    switch (role) {
      case 'student':
        userData = {
          ...userData,
          espritId,
          emailEsprit,
          applications: [],
          files: {},
        };
        // Check if esprit ID already exists
        const existingStudent = await users.findOne({ espritId });
        if (existingStudent) {
          return res.status(400).json({
            message: 'Student with this Esprit ID already exists'
          });
        }
        break;
      case 'teacher':
        userData = {
          ...userData,
          department,
          isDepartmentHead: false,
          recommendations: [],
        };
        break;
      case 'university':
        userData = {
          ...userData,
          universityName,
          country,
          website: website || '',
          description: description || '',
          offers: [],
        };
        break;
      default:
        return res.status(400).json({
          message: 'Invalid role specified'
        });
    }

    // Insert user
    const result = await users.insertOne(userData);

    res.status(201).json({
      message: 'Account created successfully',
      userId: result.insertedId
    });
  } catch (error) {
    console.error('Account creation error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;

// Export offer data
router.get('/export-offer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const offers = db.collection('offers');
    const users = db.collection('users');

    // Get offer with applications
    const offer = await offers.findOne({ _id: new ObjectId(id) });
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Prepare offer data
    const offerData = [{
      'Offer Title': offer.title,
      'University': offer.universityName,
      'Country': offer.country,
      'Field of Study': offer.fieldOfStudy,
      'Degree': offer.degree,
      'Spots': offer.numberOfSpots,
      'Applications': offer.applications?.length || 0,
      'Deadline': new Date(offer.deadline).toLocaleDateString(),
      'Start Date': new Date(offer.startDate).toLocaleDateString(),
      'Duration': offer.duration,
      'Language': offer.language,
      'Tuition Fee': offer.tuitionFee || 'N/A',
      'Scholarship': offer.scholarship ? 'Yes' : 'No',
      'Status': offer.isActive ? 'Active' : 'Inactive',
      'Created At': new Date(offer.createdAt).toLocaleDateString(),
    }];

    // Prepare applications data
    const applicationsData = [];
    if (offer.applications && offer.applications.length > 0) {
      for (const app of offer.applications) {
        applicationsData.push({
          'Student Name': `${app.studentInfo.firstName} ${app.studentInfo.lastName}`,
          'Student Email': app.studentInfo.email,
          'Esprit ID': app.studentInfo.espritId,
          'Field of Study': app.studentInfo.fieldOfStudy || 'N/A',
          'GPA': app.studentInfo.degreeNote || 'N/A',
          'Status': app.status,
          'Applied At': new Date(app.appliedAt).toLocaleDateString(),
          'Recommendations': app.recommendations?.length || 0,
        });
      }
    }

    // Prepare recommendations data
    const recommendationsData = [];
    if (offer.applications && offer.applications.length > 0) {
      for (const app of offer.applications) {
        if (app.recommendations && app.recommendations.length > 0) {
          for (const rec of app.recommendations) {
            recommendationsData.push({
              'Student Name': `${app.studentInfo.firstName} ${app.studentInfo.lastName}`,
              'Student ID': app.studentInfo.espritId,
              'Teacher Name': rec.teacherName,
              'Department': rec.department,
              'Rating': rec.rating,
              'Message': rec.message,
              'Created At': new Date(rec.createdAt).toLocaleDateString(),
            });
          }
        }
      }
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Add worksheets
    const offerWorksheet = XLSX.utils.json_to_sheet(offerData);
    const applicationsWorksheet = XLSX.utils.json_to_sheet(applicationsData);
    const recommendationsWorksheet = XLSX.utils.json_to_sheet(recommendationsData);
    
    XLSX.utils.book_append_sheet(workbook, offerWorksheet, 'Offer Details');
    XLSX.utils.book_append_sheet(workbook, applicationsWorksheet, 'Applications');
    XLSX.utils.book_append_sheet(workbook, recommendationsWorksheet, 'Recommendations');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="offer-${offer.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting offer data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});