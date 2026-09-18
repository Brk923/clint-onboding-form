const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Mongoose Schema
const briefSchema = new mongoose.Schema({
  refId: { type: String, default: () => 'SY-' + Math.floor(100000 + Math.random() * 900000) },
  status: { type: String, default: 'New' },
  
  clientName: { type: String, default: 'N/A' },
  businessName: { type: String, default: 'N/A' },
  tagline: { type: String, default: 'N/A' },
  industry: { type: String, default: 'N/A' },
  email: { type: String, default: 'N/A' },
  phone: { type: String, default: 'N/A' },
  
  objectives: { type: mongoose.Schema.Types.Mixed, default: 'N/A' },
  objectivesDetail: { type: String, default: 'N/A' },
  audience: { type: String, default: 'N/A' },
  competitor1_url: { type: String, default: '' },
  competitor1_notes: { type: String, default: '' },
  competitor2_url: { type: String, default: '' },
  competitor2_notes: { type: String, default: '' },
  competitor3_url: { type: String, default: '' },
  competitor3_notes: { type: String, default: '' },

  visualStyle: { type: String, default: 'N/A' },
  brand_logo: { type: String, default: 'N/A' },
  brand_guidelines: { type: String, default: 'N/A' },
  brand_colors: { type: String, default: 'N/A' },
  brand_fonts: { type: String, default: 'N/A' },
  inspiration1_url: { type: String, default: '' },
  inspiration1_notes: { type: String, default: '' },
  inspiration2_url: { type: String, default: '' },
  inspiration2_notes: { type: String, default: '' },
  inspiration3_url: { type: String, default: '' },
  inspiration3_notes: { type: String, default: '' },

  pages: { type: mongoose.Schema.Types.Mixed, default: 'N/A' },
  customPages: { type: String, default: 'N/A' },
  contentReady: { type: String, default: 'N/A' },
  mediaLink: { type: String, default: 'N/A' },

  domainStatus: { type: String, default: 'N/A' },
  domainName: { type: String, default: 'N/A' },
  hostingStatus: { type: String, default: 'N/A' },
  features: { type: mongoose.Schema.Types.Mixed, default: 'N/A' },
  targetDate: { type: String, default: 'N/A' },
  notes: { type: String, default: 'N/A' },

  createdAt: { type: Date, default: Date.now }
});

const Brief = mongoose.models.Brief || mongoose.model('Brief', briefSchema);

// Cached Mongoose connection for Vercel Serverless Functions
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing on Vercel.');
  }
  cachedDb = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });
  return cachedDb;
}

// Middleware to ensure Database Connection on API routes
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectToDatabase();
      next();
    } catch (err) {
      console.error('MongoDB connection error:', err);
      return res.status(500).json({
        success: false,
        error: 'MongoDB Connection Failed',
        details: err.message
      });
    }
  } else {
    next();
  }
});

// API Routes
app.post('/api/briefs', async (req, res) => {
  try {
    const newBrief = new Brief(req.body);
    const savedBrief = await newBrief.save();
    res.status(201).json({ success: true, message: 'Brief saved to MongoDB', brief: savedBrief });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/briefs', async (req, res) => {
  try {
    const briefs = await Brief.find().sort({ createdAt: -1 });
    res.json({ success: true, count: briefs.length, briefs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/briefs/:id', async (req, res) => {
  try {
    const brief = await Brief.findById(req.params.id);
    if (!brief) return res.status(404).json({ success: false, message: 'Brief not found' });
    res.json({ success: true, brief });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/briefs/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBrief = await Brief.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, brief: updatedBrief });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/briefs/:id', async (req, res) => {
  try {
    await Brief.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Brief deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Explicit routes for Admin Dashboard and Client Portal
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/portal', (req, res) => {
  res.sendFile(path.join(__dirname, 'portel.html'));
});

app.get('/portel.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'portel.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'portel.html'));
});

// Start Server locally
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Siyantra Backend Server running on http://localhost:${PORT}`);
    console.log(`📋 Admin Dashboard available at http://localhost:${PORT}/admin.html`);
  });
}

module.exports = app;
