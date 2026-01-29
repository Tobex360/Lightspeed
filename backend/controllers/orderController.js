const Order = require("../models/order");
const mongoose = require('mongoose');


exports.createOrder = async(req,res)=>{
    try{
        const data = req.body;
        
        // Validate that sender and receiver are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(data.sender)) {
            return res.status(400).send({message: "Invalid sender ID"});
        }
        if (!mongoose.Types.ObjectId.isValid(data.receiver)) {
            return res.status(400).send({message: "Invalid receiver ID"});
        }
        
        const order = new Order({
            sender: new mongoose.Types.ObjectId(data.sender),
            receiver: new mongoose.Types.ObjectId(data.receiver),
            driver: data.driver ? new mongoose.Types.ObjectId(data.driver) : null,
            packageName: data.packageName,
            size: data.size,
            description: data.description
        });
        
        const result = await order.save();
        console.log(result);
        res.status(201).send({message:"Order Created", order: result})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.getOutgoingOrders = async(req,res)=>{
    try{
        const {userId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }
        
        const orders = await Order.find({sender: userId, })
            .populate('receiver', 'username')
            .populate('driver', 'username')
            .sort({createdAt: -1});
        
        res.status(200).send({message:"Orders retrieved", orders: orders})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.getIncomingOrders = async(req,res)=>{
    try{
        const {userId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }
        
        const orders = await Order.find({receiver: userId, status: {$in: ['accepted', 'in-transit', 'completed', 'driver-pending']}})
            .populate('sender', 'username')
            .populate('driver', 'username')
            .sort({createdAt: -1});
        
        res.status(200).send({message:"Orders retrieved", orders: orders})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.getReceiverPendingOrders = async(req,res)=>{
    try{
        const {userId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }
        
        const orders = await Order.find({receiver: userId, status: 'pending'})
            .populate('sender', 'username')
            .sort({createdAt: -1});
        
        res.status(200).send({message:"Pending orders retrieved", orders: orders})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.getDriverPendingOrders = async(req,res)=>{
    try{
        const {userId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }
        
        const orders = await Order.find({driver: userId, status: 'driver-pending'})
            .populate('sender', 'username')
            .populate('receiver', 'username')
            .sort({createdAt: -1});
        
        res.status(200).send({message:"Driver pending orders retrieved", orders: orders})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.acceptOrderByReceiver = async(req,res)=>{
    try{
        const {orderId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({message: "Invalid order ID"});
        }
        
        const order = await Order.findByIdAndUpdate(
            orderId,
            {status: 'driver-pending'},
            {new: true}
        ).populate('sender', 'username').populate('receiver', 'username').populate('driver', 'username');
        
        res.status(200).send({message:"Order accepted by receiver", order: order})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.declineOrderByReceiver = async(req,res)=>{
    try{
        const {orderId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({message: "Invalid order ID"});
        }
        
        const order = await Order.findByIdAndUpdate(
            orderId,
            {status: 'cancelled'},
            {new: true}
        ).populate('sender', 'username').populate('receiver', 'username').populate('driver', 'username');
        
        res.status(200).send({message:"Order declined by receiver", order: order})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.acceptOrderByDriver = async(req,res)=>{
    try{
        const {orderId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({message: "Invalid order ID"});
        }
        
        const order = await Order.findByIdAndUpdate(
            orderId,
            {status: 'accepted'},
            {new: true}
        ).populate('sender', 'username').populate('receiver', 'username').populate('driver', 'username');
        
        res.status(200).send({message:"Order accepted by driver", order: order})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.declineOrderByDriver = async(req,res)=>{
    try{
        const {orderId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({message: "Invalid order ID"});
        }
        
        const order = await Order.findByIdAndUpdate(
            orderId,
            {status: 'cancelled', driver: null},
            {new: true}
        ).populate('sender', 'username').populate('receiver', 'username').populate('driver', 'username');
        
        res.status(200).send({message:"Order declined by driver", order: order})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.getDriverOngoingOrders = async(req,res)=>{
    try{
        const {userId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }
        
        const orders = await Order.find({
            driver: userId, 
            status: {$in: ['accepted', 'in-transit', 'completed']}
        })
            .populate('sender', 'username')
            .populate('receiver', 'username')
            .sort({createdAt: -1});
        
        res.status(200).send({message:"Driver ongoing orders retrieved", orders: orders})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.updateOrderStatus = async(req,res)=>{
    try{
        const {orderId} = req.params;
        const {status} = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({message: "Invalid order ID"});
        }
        
        const validStatuses = ['accepted', 'in-transit', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({message: "Invalid status"});
        }
        
        const order = await Order.findByIdAndUpdate(
            orderId,
            {status: status},
            {new: true}
        ).populate('sender', 'username').populate('receiver', 'username').populate('driver', 'username');
        
        res.status(200).send({message:"Order status updated", order: order})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.getCompletedOrders = async(req,res)=>{
    try{
        const {userId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({message: "Invalid user ID"});
        }
        
        const orders = await Order.find({
            $or: [
                {sender: userId, status: 'completed'},
                {receiver: userId, status: 'completed'},
                {driver: userId, status: 'completed'}
            ]
        })
            .populate('sender', 'username')
            .populate('receiver', 'username')
            .populate('driver', 'username')
            .sort({createdAt: -1});
        
        res.status(200).send({message:"Completed orders retrieved", orders: orders})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}

exports.deleteOrder = async(req,res)=>{
    try{
        const {orderId} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).send({message: "Invalid order ID"});
        }
        
        const order = await Order.findByIdAndDelete(orderId);
        
        if (!order) {
            return res.status(404).send({message: "Order not found"});
        }
        
        res.status(200).send({message:"Order deleted successfully", order: order})
    }catch(err){
        console.log(err)
        res.status(500).send({message: err.message})
    }
}