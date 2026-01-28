const express = require('express');
const {createOrder, getOutgoingOrders, getIncomingOrders, getReceiverPendingOrders, getDriverPendingOrders, acceptOrderByReceiver, declineOrderByReceiver, acceptOrderByDriver, declineOrderByDriver} = require('../controllers/orderController')
const router = express.Router();



router.post('/create', createOrder);
router.get('/outgoing/:userId', getOutgoingOrders);
router.get('/incoming/:userId', getIncomingOrders);
router.get('/receiver-pending/:userId', getReceiverPendingOrders);
router.get('/driver-pending/:userId', getDriverPendingOrders);
router.put('/accept-receiver/:orderId', acceptOrderByReceiver);
router.put('/decline-receiver/:orderId', declineOrderByReceiver);
router.put('/accept-driver/:orderId', acceptOrderByDriver);
router.put('/decline-driver/:orderId', declineOrderByDriver);

module.exports = router;