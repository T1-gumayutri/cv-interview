const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');

router.post('/', upload.single('cv'), uploadController.uploadCV);

module.exports = router;
