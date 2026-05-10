const Session = require('../models/Session');
const geminiService = require('../services/geminiService');

exports.completeInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.answers.length === 0) {
      return res.status(400).json({ error: 'No answers found to evaluate' });
    }

    // Call Gemini for final report
    const finalReport = await geminiService.generateFinalReport(
      session.fitScore,
      session.fitVerdict,
      session.missingSkills,
      session.answers,
      session.interviewLanguage
    );

    // Calculate average score
    const totalScore = session.answers.reduce((acc, curr) => acc + curr.score, 0) / session.answers.length;

    session.totalScore = Math.round(totalScore * 10) / 10; // Round to 1 decimal
    session.overallFeedback = finalReport.overallFeedback;
    session.closingGaps = finalReport.closingGaps;
    session.hiringRecommendation = finalReport.hiringRecommendation;
    session.status = 'completed';

    await session.save();

    res.status(200).json(session);

  } catch (error) {
    console.error('Complete Interview Error:', error);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
};

exports.getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error('Get Session Error:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
};

exports.addExtraQuestion = async (req, res) => {
  try {
    const { sessionId, difficulty } = req.body;

    if (!sessionId || !difficulty) {
      return res.status(400).json({ error: 'sessionId and difficulty are required' });
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const currentQuestionsCount = session.questions.length;
    
    // Call Gemini to generate an extra question
    const extraQuestionData = await geminiService.generateExtraQuestion(
      session.jobDescription,
      session.missingSkills,
      difficulty,
      currentQuestionsCount,
      session.interviewLanguage
    );

    if (extraQuestionData && extraQuestionData.question) {
      session.questions.push(extraQuestionData.question);
      await session.save();
      return res.status(200).json(session);
    } else {
      throw new Error("Failed to generate extra question");
    }

  } catch (error) {
    console.error('Add Extra Question Error:', error);
    res.status(500).json({ error: 'Failed to add extra question' });
  }
};
