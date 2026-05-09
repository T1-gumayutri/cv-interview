const Session = require('../models/Session');
const geminiService = require('../services/geminiService');

exports.evaluateAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, transcript } = req.body;

    if (!sessionId || questionId === undefined || !transcript) {
      return res.status(400).json({ error: 'sessionId, questionId, and transcript are required' });
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const qIdNum = Number(questionId);
    const question = session.questions.find(q => q.id === qIdNum);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Evaluate answer with Gemini
    const evaluation = await geminiService.evaluateAnswer(
      session.jobDescription,
      question.text,
      question.type,
      transcript,
      session.interviewLanguage
    );

    let audioUrl = null;
    if (req.file) {
      audioUrl = req.file.filename;
      if (!session.audioUrls) session.audioUrls = [];
      session.audioUrls.push(audioUrl);
    }

    const newAnswer = {
      questionId: qIdNum,
      transcript,
      correctedTranscript: evaluation.correctedTranscript,
      score: evaluation.score,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      modelAnswer: evaluation.modelAnswer,
      tip: evaluation.tip,
      audioUrl
    };

    session.answers.push(newAnswer);
    session.status = 'in_progress';
    await session.save();

    res.status(200).json(newAnswer);

  } catch (error) {
    console.error('Evaluate Answer Error:', error);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
};
