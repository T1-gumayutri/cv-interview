const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/complete', interviewController.completeInterview);
router.get('/:sessionId', interviewController.getSession);

module.exports = router;
