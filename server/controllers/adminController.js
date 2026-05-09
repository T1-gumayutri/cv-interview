const Session = require('../models/Session');
const Admin = require('../models/Admin');
const Settings = require('../models/Settings');
const path = require('path');
const fs = require('fs');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin') {
      return res.json({ token: 'dummy-jwt-token-12345' });
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.mode) {
      filter.mode = req.query.mode;
    }
    const sessions = await Session.find(filter).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { companyJobDescription } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ companyJobDescription });
    } else {
      settings.companyJobDescription = companyJobDescription;
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

exports.getFile = (req, res) => {
  const { type, filename } = req.params;
  
  // Basic validation to prevent directory traversal
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  let folder = '';
  if (type === 'cv') folder = 'cvs';
  else if (type === 'audio') folder = 'audio';
  else return res.status(400).json({ error: 'Invalid file type' });

  const filePath = path.join(__dirname, `../uploads/${folder}`, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(filePath);
};
