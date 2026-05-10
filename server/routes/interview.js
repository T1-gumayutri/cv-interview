const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/complete', interviewController.completeInterview);
router.post('/add-question', interviewController.addExtraQuestion);
router.get('/:sessionId', interviewController.getSession);

module.exports = router;
