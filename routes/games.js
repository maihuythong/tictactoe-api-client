const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');

// router.get('/', boardController.getAllBoard);
router.post('/', gamesController.createNewGame);
router.post('/join/:id', gamesController.joinGame);

router.get('/', gamesController.getGames);
router.get('/:id', gamesController.getOneGame);
router.put('/:id', gamesController.updateGame);
router.delete('/:id', gamesController.deleteGame);

module.exports = router;
