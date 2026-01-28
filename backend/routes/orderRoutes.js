const express = require('express');
const {createOrder, getOutgoingOrders, getIncomingOrders} = require('../controllers/orderController')
const router = express.Router();



router.post('/create', createOrder);
router.get('/outgoing/:userId', getOutgoingOrders);
router.get('/incoming/:userId', getIncomingOrders);

module.exports = router;