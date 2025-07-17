const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.model');
const { adminOnly } = require('../middleware/auth.middleware');


router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find({ customerId: req.user.customerId });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/', adminOnly, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTicket = await Ticket.create({
      title,
      description,
      status: 'Open',
      customerId: req.user.customerId,
    });

    
    setTimeout(async () => {
        try {
            await Ticket.findByIdAndUpdate(newTicket._id, { status: 'Done' });
            console.log(`DEMO SIMULATION: Ticket ${newTicket._id} status updated to Done.`);
        } catch (err) {
            console.error("Error in simulated callback:", err);
        }
    }, 5000); 

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
