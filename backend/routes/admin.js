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

module.exports = router;