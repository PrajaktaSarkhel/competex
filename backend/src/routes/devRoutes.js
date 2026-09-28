const express = require('express');
const router = express.Router();
const { resetSeed, getDevUsers, simulateConcurrency } = require('../controllers/devController');

router.post('/reset-seed', resetSeed);
router.get('/users', getDevUsers);
router.post('/simulate-concurrency', simulateConcurrency);

module.exports = router;
