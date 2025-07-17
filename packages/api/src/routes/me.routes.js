const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Customer = require('../models/customer.model');

router.get('/screens', async (req, res) => {
    try {
        const customer = await Customer.findById(req.user.customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const registryPath = path.join(__dirname, '../../../../registry.json');
        const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        const tenantScreens = registry.find(r => r.customerName === customer.name);

        res.status(200).json(tenantScreens ? tenantScreens.screens : []);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;