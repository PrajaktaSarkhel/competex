const express = require('express');
const router = express.Router();
const {
  registerForCompetition,
  getRegistrationStatus,
} = require('../controllers/registrationController');

router.post('/:id/register', registerForCompetition);
router.get('/:id/registration-status', getRegistrationStatus);

module.exports = router;
