const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');

// router.get('/', boardController.getAllBoard);
router.post('/', roomsController.createNewRoom);
router.post('/join/:id', roomsController.joinRoom);
router.post('/join-invite/:id', roomsController.joinRoomInvite);

router.get('/info/:id', roomsController.getRoomInfo);
router.get('/', roomsController.getRooms);
router.get('/:id', roomsController.getOneRoom);
router.put('/:id', roomsController.updateRoom);
router.delete('/:id', roomsController.deleteRoom);

module.exports = router;
