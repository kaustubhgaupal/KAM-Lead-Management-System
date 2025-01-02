const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');
const moment = require('moment');
// Protect all routes with authentication middleware
router.use(auth);

// **Lead Routes**





router.get('/performance', async (req, res) => {
  try {
      const leads = await Lead.find().sort({ performanceScore: -1 });
      res.render('leads/performance', { leads });
  } catch (error) {
      res.status(500).send('Error fetching performance tracking data');
  }
});


// Get all leads requiring calls today
router.get('/call', async (req, res) => {
    try {
        const today = moment().startOf('day');
        const leads = await Lead.find({
            lastCall: { $lte: today.subtract('callFrequency', 'days').toDate() },
        });

        res.render('leads/call', { leads });
    } catch (error) {
        res.status(500).send('Error fetching call planning data');
    }
});

// Update last call date
router.post('/call/:id', async (req, res) => {
    try {
        const leadId = req.params.id;
        await Lead.findByIdAndUpdate(leadId, { lastCall: new Date() });
        res.redirect('/leads/call-planning');
    } catch (error) {
        res.status(500).send('Error updating call data');
    }
});











router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find({ KAM: req.user });
  

    // console.log(leads);
    res.render('leads/index', { leads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/new', (req, res) => {
  
  res.render('leads/new',{error : null});
});

router.post('/', auth, async (req, res) => {
  // console.log('Logged-in user ID:', req.user); // Ensure this is correctly set
  try {
      const { restaurantName, address, phone, website } = req.body;

      if (!restaurantName || !address || !phone) {
          return res.render('leads/new', { error: 'Restaurant name, address, and phone are required.' });
      }

      const newLead = new Lead({
          restaurantName,
          address,
          phone,
          website,
          KAM: req.user // Ensure req.user contains the logged-in user ID
      });

      const savedLead = await newLead.save();
      res.redirect(`/leads/${savedLead._id}`);
  } catch (error) {
      console.error('Error saving lead:', error);
      res.render('leads/new', { error: 'Failed to create lead.' });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('KAM');

    if (!lead || !lead.KAM || !lead.KAM._id || lead.KAM._id.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized or not found.' });
  }
  

    res.render('leads/show', { lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:id/edit', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead ||lead.KAM._id.toString() !== req.user.toString() ) {      
      return res.status(403).json({ message: 'Unauthorized or not found.' });
    }

    res.render('leads/edit', { lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead || lead.KAM._id.toString() !== req.user.toString()) {      
      return res.status(403).json({ message: 'Unauthorized or not found.' });
    }

    const { restaurantName, address, phone, website } = req.body;

    lead.restaurantName = restaurantName || lead.restaurantName;
    lead.address = address || lead.address;
    lead.phone = phone || lead.phone;
    lead.website = website || lead.website;

    const updatedLead = await lead.save();
    res.redirect(`/leads/${updatedLead._id}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead  || lead.KAM._id.toString() !== req.user.toString() ) {  
      return res.status(403).json({ message: 'Unauthorized or not found.' });
    }

    await Lead.findByIdAndDelete(req.params.id); // Delete directly by ID
    res.redirect('/leads');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
