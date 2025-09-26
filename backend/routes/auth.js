const express = require('express');
const { getDB } = require('../config/database');
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
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
    const hashedPassword = await hashPassword(password);

    // Create user object based on role
    let userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role,
      isActive: role === 'student', // Students are active by default
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
      message: 'User registered successfully',
      userId: result.insertedId,
      requiresActivation: role !== 'student'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const db = getDB();
    const users = db.collection('users');

    // Find user by email and role
    const user = await users.findOne({ email, role });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        message: 'Account is not activated. Please wait for admin approval.'
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;