const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');

router.post('/', matchesController.createNewMatch);
router.get('/', matchesController.getMatches);
router.get('/:id', matchesController.getOneMatch);
router.put('/:id', matchesController.updateMatch);
router.delete('/:id', matchesController.deleteMatch);

module.exports = router;
