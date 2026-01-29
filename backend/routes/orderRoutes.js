const express = require('express');
const {createOrder, getOutgoingOrders, getIncomingOrders, getReceiverPendingOrders, getDriverPendingOrders, acceptOrderByReceiver, declineOrderByReceiver, acceptOrderByDriver, declineOrderByDriver, getDriverOngoingOrders, updateOrderStatus, getCompletedOrders, deleteOrder} = require('../controllers/orderController')
const router = express.Router();



router.post('/create', createOrder);
router.get('/outgoing/:userId', getOutgoingOrders);
router.get('/incoming/:userId', getIncomingOrders);
router.get('/receiver-pending/:userId', getReceiverPendingOrders);
router.get('/driver-pending/:userId', getDriverPendingOrders);
router.get('/driver-ongoing/:userId', getDriverOngoingOrders);
router.get('/completed/:userId', getCompletedOrders);
router.put('/accept-receiver/:orderId', acceptOrderByReceiver);
router.put('/decline-receiver/:orderId', declineOrderByReceiver);
router.put('/accept-driver/:orderId', acceptOrderByDriver);
router.put('/decline-driver/:orderId', declineOrderByDriver);
router.put('/update-status/:orderId', updateOrderStatus);
router.delete('/:orderId', deleteOrder);

module.exports = router;