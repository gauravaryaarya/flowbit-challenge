const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../../.env' });

const { protect } = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.API_PORT || 5001;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('Successfully connected to MongoDB.'))
      .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
      });
}

const authRoutes = require('./routes/auth.routes');
const meRoutes = require('./routes/me.routes');

app.get('/', (req, res) => res.status(200).json({ message: 'API is running!' }));
app.use('/api/auth', authRoutes);
app.use('/api/me', protect, meRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`API server listening on port ${PORT}`);
    });
}

module.exports = app;