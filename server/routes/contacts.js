const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

const mongoose = require('mongoose');

const checkLeadOwnership = async (req, res, next) => {
  try {
    const leadId = req.body.lead || req.params.leadId;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ message: 'Invalid lead ID' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead || lead.KAM._id.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    req.lead = lead; // Attach lead to request for further use
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Ensure the user is authenticated for all routes
router.use(auth);

// ** Create a new contact **
router.post('/', checkLeadOwnership, async (req, res) => {
  try {
    const leadId = req.body.lead;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ message: 'Invalid lead ID' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead || lead.KAM._id.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();

    // Fetch all contacts again to render the updated list
    const contacts = await Contact.find({ lead: leadId }).populate('lead');
    res.render('contacts/index', { contacts ,contacts});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// ** Get all contacts assigned to the current KAM **
router.get('/', async (req, res) => {
  try {
    // Find leads assigned to the current KAM
    const leads = await Lead.find({ KAM: req.user }).select('_id');
    const contacts = await Contact.find({ lead: { $in: leads } }).populate('lead');

    res.render('contacts/index', { contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/new', async (req, res) => {

   const leads = await Lead.find({ KAM: req.user });
   
   res.render('contacts/new',{leads});
});

// ** Get a single contact **
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('lead');

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Ensure the contact belongs to a lead assigned to the current KAM
    const lead = await Lead.findById(contact.lead);
    if (!lead || lead.KAM.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  //console.log(contact);
    res.render('contacts/show', { contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ** Edit a contact **
router.get('/:id/edit', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Ensure the contact belongs to a lead assigned to the current KAM
    const lead = await Lead.findById(contact.lead);
    if (!lead || lead.KAM.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Fetch leads assigned to the current KAM for the select dropdown
    const leads = await Lead.find({ KAM: req.user });

    res.render('contacts/edit', { contact, leads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ** Update contact details **
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Ensure the contact belongs to a lead assigned to the current KAM
    const lead = await Lead.findById(contact.lead);
    if (!lead || lead.KAM.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update contact fields
    contact.name = req.body.name || contact.name;
    contact.role = req.body.role || contact.role;
    contact.phone = req.body.phone || contact.phone;
    contact.email = req.body.email || contact.email;

    const updatedContact = await contact.save();
    res.redirect(`/contacts/${updatedContact._id}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ** Delete a contact **
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Ensure the contact belongs to a lead assigned to the current KAM
    const lead = await Lead.findById(contact.lead);
    if (!lead || !req.user || lead.KAM.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete the contact
    await Contact.findByIdAndDelete(req.params.id);

    // Redirect or send a success response
    res.redirect('/contacts');
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;