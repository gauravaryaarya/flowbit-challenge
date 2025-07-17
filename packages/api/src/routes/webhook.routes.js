const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.model');

// @desc    Webhook jise n8n call karega
// @route   POST /webhook/ticket-done
// @access  Public (lekin shared secret se protected)
router.post('/ticket-done', async (req, res) => {
    const sharedSecret = req.headers['x-shared-secret'];

    
    if (sharedSecret !== process.env.N8N_SHARED_SECRET) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const { ticketId } = req.body;
        if (!ticketId) {
            return res.status(400).send('Ticket ID is required');
        }

        await Ticket.findByIdAndUpdate(ticketId, { status: 'Done' });

        console.log(`Webhook received: Ticket ${ticketId} status updated to Done.`);
        res.status(200).send('Webhook processed successfully.');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;