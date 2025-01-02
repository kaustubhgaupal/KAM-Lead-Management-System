const express = require('express');
const router = express.Router();
const Interaction = require('../models/Interaction');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

router.use(auth);

// **Interaction Routes**

router.get('/', async (req, res) => {
  try {
    // Find leads assigned to the current KAM
    const leads = await Lead.find({ KAM: req.user }).select('_id');
    const interactions = await Interaction.find({ lead: { $in: leads } }).populate('lead');
    
    res.render('interactions/index', { interactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/new', async (req, res) => {
  try {
    const leads = await Lead.find({ KAM: req.user });
    res.render('interactions/new', { leads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { lead, type, notes, date } = req.body;

    if (!lead || !type || !notes || !date) {
      const leads = await Lead.find({ KAM: req.user });
      return res.render('interactions/new', { error: 'All fields are required', leads });
    }

    const newInteraction = new Interaction({ lead, type, notes, date });
    const savedInteraction = await newInteraction.save();

    // After saving the interaction, update the corresponding lead's last call and performance score
    const currentLead = await Lead.findById(lead);
    const currentDate = new Date();

    // Update the last call date for the lead
    currentLead.lastCall = currentDate;

    // Performance Tracking (simple example: increment score after interaction)
    currentLead.performanceScore += 10; // Increase performance score for this lead

    await currentLead.save();

    res.redirect(`/interactions/${savedInteraction._id}`);
  } catch (error) {
    res.render('interactions/new', { error: 'Failed to create interaction' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id).populate('lead');

    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    const lead = await Lead.findById(interaction.lead);
    if (!lead || lead.KAM.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.render('interactions/show', { interaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id);

    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    const lead = await Lead.findById(interaction.lead);
    if (!lead || lead.KAM.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const leads = await Lead.find({ KAM: req.user });
    res.render('interactions/edit', { interaction, leads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id);

    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    const lead = await Lead.findById(interaction.lead);
    if (!lead || lead.KAM.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    interaction.type = req.body.type || interaction.type;
    interaction.notes = req.body.notes || interaction.notes;
    interaction.date = req.body.date || interaction.date;

    const updatedInteraction = await interaction.save();

    // After editing, update the lead's last call and performance score again
    lead.lastCall = new Date();
    lead.performanceScore += 5; // Increment performance score by 5 for every edit

    await lead.save();

    res.redirect(`/interactions/${updatedInteraction._id}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id);

    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    const lead = await Lead.findById(interaction.lead);
    if (!lead || lead.KAM.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Interaction.findByIdAndDelete(req.params.id);

    // After deleting the interaction, you may want to reset the performance score or take another action
    lead.performanceScore -= 5; // Reduce performance score for interaction deletion (example)
    await lead.save();

    res.redirect('/interactions');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
