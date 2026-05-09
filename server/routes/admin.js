const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.get('/sessions', adminController.getSessions);

router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.updateSettings);

router.get('/files/:type/:filename', adminController.getFile);

module.exports = router;
