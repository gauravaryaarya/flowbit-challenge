const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const router = express.Router();

const generateToken = (id, role, customerId) => {
  return jwt.sign({ id, role, customerId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                token: generateToken(user._id, user.role, user.customerId),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;