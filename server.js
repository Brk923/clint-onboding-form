const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/siyantra_briefs';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Mongoose Schema
const briefSchema = new mongoose.Schema({
  refId: { type: String, default: () => 'SY-' + Math.floor(100000 + Math.random() * 900000) },
  status: { type: String, default: 'New' }, // New, In Review, Building, Completed
  
  // Section 1: Client & Business Overview
  clientName: { type: String, default: 'N/A' },
  businessName: { type: String, default: 'N/A' },
  tagline: { type: String, default: 'N/A' },
  industry: { type: String, default: 'N/A' },
  email: { type: String, default: 'N/A' },
  phone: { type: String, default: 'N/A' },
  
  // Section 2: Goals & Audience
  objectives: { type: mongoose.Schema.Types.Mixed, default: 'N/A' },
  objectivesDetail: { type: String, default: 'N/A' },
  audience: { type: String, default: 'N/A' },
  competitor1_url: { type: String, default: '' },
  competitor1_notes: { type: String, default: '' },
  competitor2_url: { type: String, default: '' },
  competitor2_notes: { type: String, default: '' },
  competitor3_url: { type: String, default: '' },
  competitor3_notes: { type: String, default: '' },

  // Section 3: Branding & Design Direction
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

  // Section 4: Pages & Content
  pages: { type: mongoose.Schema.Types.Mixed, default: 'N/A' },
  customPages: { type: String, default: 'N/A' },
  contentReady: { type: String, default: 'N/A' },
  mediaLink: { type: String, default: 'N/A' },

  // Section 5: Technical Setup & Timeline
  domainStatus: { type: String, default: 'N/A' },
  domainName: { type: String, default: 'N/A' },
  hostingStatus: { type: String, default: 'N/A' },
  features: { type: mongoose.Schema.Types.Mixed, default: 'N/A' },
  targetDate: { type: String, default: 'N/A' },
  notes: { type: String, default: 'N/A' },

  createdAt: { type: Date, default: Date.now }
});

const Brief = mongoose.model('Brief', briefSchema);

// MongoDB Connect
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected successfully to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// API Routes

// 1. Submit a new Brief (Used by portel.html)
app.post('/api/briefs', async (req, res) => {
  try {
    const newBrief = new Brief(req.body);
    const savedBrief = await newBrief.save();
    res.status(201).json({ success: true, message: 'Brief saved to MongoDB successfully', brief: savedBrief });
  } catch (error) {
    console.error('Error saving brief:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get All Briefs (Used by admin.html)
app.get('/api/briefs', async (req, res) => {
  try {
    const briefs = await Brief.find().sort({ createdAt: -1 });
    res.json({ success: true, count: briefs.length, briefs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Get Single Brief by ID
app.get('/api/briefs/:id', async (req, res) => {
  try {
    const brief = await Brief.findById(req.params.id);
    if (!brief) return res.status(404).json({ success: false, message: 'Brief not found' });
    res.json({ success: true, brief });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Update Brief Status
app.patch('/api/briefs/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBrief = await Brief.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, brief: updatedBrief });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Delete Brief
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

// Serve portel.html by default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'portel.html'));
});

// Start Server (only if not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Siyantra Backend Server running on http://localhost:${PORT}`);
    console.log(`📋 Admin Dashboard available at http://localhost:${PORT}/admin.html`);
  });
}

module.exports = app;
