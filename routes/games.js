const express = require('express');
const router = express.Router();
const gameControllers = require('../controllers/games');

// router.get('/', boardController.getAllBoard);
router.post('/', gameControllers.createNewGame);

module.exports = router;
