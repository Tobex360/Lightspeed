const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const authUroutes = require('./routes/authUroutes');
const authDroutes = require('./routes/authDroutes');
const orderRoutes = require('./routes/orderRoutes')
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const { timeStamp } = require('console');


const app = express();
const server = http.createServer(app);

// Socket.io setup with Cors
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173/",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// .env stuff
require('dotenv').config();
const PORT = process.env.PORT || 7000;
const DB_URL = process.env.DB_URL;

// middleware
app.use(cors());
app.use(express.json());

app.set('io', io);

// Routes
app.use('/user',authUroutes);
app.use('/driver',authDroutes);
app.use('/order',orderRoutes);

//MongoDB connection
mongoose.connect(DB_URL).then((result)=>{
    console.log('succesfully connected to mongodb')
}).catch(err=>{
    console.log('connected to mongo db')
})

// Socket.io connection handling
io.on('connection',(socket)=>{
    console.log('User connected:', socket.id);

    //Driver joins their own room
    socket.on('driver:join', (driverId)=>{
        socket.join(`driver:${driverId}`);
        console.log(`Driver ${driverId} joined their room`);
    });

    // User joines Order tracking room
    socket.on('order:track', (orderId)=>{
        socket.join(`order:${orderId}`);
        console.log(`User joined order tracking room: ${orderId}`);
    });

    //Driver sends location update
    socket.on('driver:location', async(data)=>{
        const { driverId, orderId, location } = data;

        console.log(`Driver ${driverId} location:`, location);

        //Broadcast to all users tracking this order
        io.to(`order:${orderId}`).emit('location:update', {
            driverId,
            location,
            timeStamp:new Date()
        });

        // save to db
        try{
            const Order = require('./models/order');
            await Order.findByIdAndUpdate(orderId, {
                'driver.currentLocation': location
            });
        } catch (error) {
            console.error('Error updating driver location:', error);
        }

    });

    // Order status update
    socket.on('order:statusUpdate', async(data)=>{
        const { orderId, status } = data;
        console.log(`Order ${orderId} status changed to ${status}`);

        // Update database
        try{
            const Order = require('./models/order');
            await Order.findByIdAndUpdate(orderId, { status });

            // Broadcast to all users tracking this order
            io.to(`order:${orderId}`).emit('status:update', {
                orderId,
                status,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    });

    // New order notification to available drivers
    socket.on('order:new', (orderData)=>{
        console.log('New order Created:', orderData._id);

        // Broadcast to all connected drivers
        io.emit('order:available', orderData);
    });

    //Disconnect
    socket.on('disconnect', ()=>{
        console.log("User disconnected:", socket.id);
    });


});

server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io};