const express = require('express');
const router = express.Router();
const {
  getCompetitionDetails,
  getAllCompetitions,
  getCompetitionReviews,
  updateCompetitionLifecycle,
} = require('../controllers/competitionController');

router.get('/', getAllCompetitions);
router.get('/:idOrSlug', getCompetitionDetails);
router.get('/:id/reviews', getCompetitionReviews);
router.patch('/:id/admin/lifecycle', updateCompetitionLifecycle);

module.exports = router;
