const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// Middleware to protect dashboard
router.use(auth);

// Dashboard route
router.get('/', (req, res) => {
  res.render('dashboard');
});

module.exports = router;
