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