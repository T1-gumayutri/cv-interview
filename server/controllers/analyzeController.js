const Session = require('../models/Session');
const Settings = require('../models/Settings');
const geminiService = require('../services/geminiService');

exports.analyzeGap = async (req, res) => {
  try {
    const { sessionId, jobDescription: bodyJD } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    let jobDescription = bodyJD;

    if (session.mode === 'company') {
      const settings = await Settings.findOne();
      if (!settings || !settings.companyJobDescription) {
        return res.status(400).json({ error: 'Company Job Description is not set by Admin.' });
      }
      jobDescription = settings.companyJobDescription;
    } else {
      if (!jobDescription) {
         return res.status(400).json({ error: 'jobDescription is required for practice mode' });
      }
    }

    session.jobDescription = jobDescription;
    await session.save();

    // Call Gemini #1: Gap Analysis
    const gapAnalysis = await geminiService.analyzeGap(session.cvText, jobDescription, session.interviewLanguage);
    
    session.candidateName = gapAnalysis.candidateName;
    session.fitScore = gapAnalysis.fitScore;
    session.fitVerdict = gapAnalysis.fitVerdict;
    session.matchedSkills = gapAnalysis.matchedSkills;
    session.missingSkills = gapAnalysis.missingSkills;
    session.overqualified = gapAnalysis.overqualified;
    session.summary = gapAnalysis.summary;

    // Call Gemini #2: Generate targeted questions
    const generatedQuestions = await geminiService.generateQuestions(gapAnalysis, jobDescription, session.interviewLanguage);
    
    session.questions = generatedQuestions.questions;
    session.status = 'analyzed';

    await session.save();

    res.status(200).json({
      sessionId: session.sessionId,
      candidateName: session.candidateName,
      fitScore: session.fitScore,
      fitVerdict: session.fitVerdict,
      matchedSkills: session.matchedSkills,
      missingSkills: session.missingSkills,
      overqualified: session.overqualified,
      summary: session.summary,
      questions: session.questions
    });

  } catch (error) {
    console.error('Analyze Gap Error:', error);
    res.status(500).json({ error: 'Failed to analyze gap' });
  }
};
