const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getMySubmission,
} = require('../controllers/submissionController');

router.post('/:id/submissions', createSubmission);
router.get('/:id/submissions/me', getMySubmission);

module.exports = router;
