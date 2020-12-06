const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board');

router.get('/', boardController.getAllBoard);

module.exports = router;
