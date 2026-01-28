const express = require('express');
const {createOrder, getOutgoingOrders} = require('../controllers/orderController')
const router = express.Router();



router.post('/create', createOrder);
router.get('/outgoing/:userId', getOutgoingOrders);

module.exports = router;