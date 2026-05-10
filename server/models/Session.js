const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: Number,
  text: String,
  topic: String,
  type: {
    type: String,
    enum: ['gap_probe', 'behavioral', 'reality_check', 'extra_probe']
  }
});

const answerSchema = new mongoose.Schema({
  questionId: Number,
  transcript: String,
  correctedTranscript: String,
  score: Number,
  strengths: String,
  weaknesses: String,
  modelAnswer: String,
  tip: String,
  audioUrl: String
});

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  mode: {
    type: String,
    enum: ['practice', 'company'],
    default: 'practice'
  },
  interviewLanguage: {
    type: String,
    enum: ['vi-VN', 'en-US'],
    default: 'vi-VN'
  },
  candidateName: String,
  candidateEmail: String,
  cvUrl: String,
  audioUrls: [String],
  cvText: String,
  jobDescription: String,
  fitScore: Number,
  matchedSkills: [String],
  missingSkills: [String],
  overqualified: [String],
  fitVerdict: {
    type: String,
    enum: ['Strong Fit', 'Partial Fit', 'Not Ready Yet']
  },
  summary: String,
  questions: [questionSchema],
  answers: [answerSchema],
  totalScore: Number,
  overallFeedback: String,
  closingGaps: [String],
  hiringRecommendation: {
    type: String,
    enum: ['Hire', 'Maybe', 'Not Yet']
  },
  status: {
    type: String,
    enum: ['pending', 'analyzed', 'in_progress', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', sessionSchema);
