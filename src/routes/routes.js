const express = require('express');
const router = express.Router();
const ticketController = require('../controller/ticketController');

router.post('/generate-tickets/:setNumber', ticketController.ticketGenerator);
router.get('/get-tickets', ticketController.getTambolaSet);


module.exports = router;
