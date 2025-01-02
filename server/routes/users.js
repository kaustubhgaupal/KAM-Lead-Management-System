const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });
const  JWT_SECRET  = process.env.JWT_SECRET;



// Register a new user (GET route to show the registration page)
router.get('/register', (req, res) => {
  res.render('register',{error: null}); // Render the register view
});









// Handle registration (POST route to process registration)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('register', { error: 'Email already exists' });
    }

    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();

    // Generate JWT
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET);

    // Store the token in a cookie
    res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 });

    // Redirect to the home page or dashboard
    res.redirect('/');
  } catch (error) {
    res.render('register', { error: error.message });
  }
});

// Login (GET route to show the login page)
router.get('/login', (req, res) => {
  res.render('login',{error: null}); // Render the login view
});

// Handle login (POST route to process login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Store the token in a cookie
    res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7200000 });

    // Redirect to the home page or dashboard
    res.redirect('/dashboard');
  } catch (error) {
    res.render('login', { error: error.message });
  }
});

// Logout route to clear the cookie
router.get('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/');
});

module.exports = router;
