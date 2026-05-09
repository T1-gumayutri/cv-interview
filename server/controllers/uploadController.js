const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');
const pdfParser = require('../services/pdfParser');
const fs = require('fs');

exports.uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { mode, candidateName, candidateEmail, interviewLanguage } = req.body;

    const sessionId = uuidv4();
    const cvText = await pdfParser.parsePDF(req.file.path);
    
    // We keep the file to allow Admin to download/view it
    const cvUrl = req.file.filename;

    const sessionData = {
      sessionId,
      cvText,
      cvUrl,
      status: 'pending',
      mode: mode || 'practice',
      candidateName,
      candidateEmail,
      interviewLanguage: interviewLanguage || 'vi-VN'
    };

    const session = new Session(sessionData);
    await session.save();

    res.status(200).json({
      sessionId,
      cvPreview: cvText.substring(0, 500)
    });

  } catch (error) {
    console.error('Upload CV Error:', error);
    // Only delete on failure
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to process CV' });
  }
};
