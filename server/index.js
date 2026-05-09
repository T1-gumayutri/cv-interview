require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const uploadRoutes = require('./routes/upload');
const analyzeRoutes = require('./routes/analyze');
const evaluateRoutes = require('./routes/evaluate');
const interviewRoutes = require('./routes/interview');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json({ limit: '10mb' }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/evaluate', evaluateRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/admin', adminRoutes);

const Settings = require('./models/Settings');
app.get('/api/jobs/active', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({ companyJobDescription: settings?.companyJobDescription || '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active JD' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
