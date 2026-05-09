const express = require('express');
const router = express.Router();
const evaluateController = require('../controllers/evaluateController');
const upload = require('../middleware/upload');

// upload.single is optional, if req.file is undefined, multer just proceeds
router.post('/', upload.single('audio'), evaluateController.evaluateAnswer);

module.exports = router;
