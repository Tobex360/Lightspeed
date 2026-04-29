const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authUroutes = require('./routes/authUroutes');
const authDroutes = require('./routes/authDroutes');
const orderRoutes = require('./routes/orderRoutes')
const cors = require('cors');
const path = require('path');


require('dotenv').config();



const PORT = process.env.PORT || 7000;
const DB_URL = process.env.DB_URL4;

app.use(cors({
    origin:[
        'https://lightspeed-red.vercel.app',
        "http://localhost:5174"
    ],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}));
app.use(express.json());

//health route for uptime robot

app.get('/api/health',(req, res)=>{
    res.status(200).json({ status: 'ok' })
})



app.use('/user',authUroutes);
app.use('/driver',authDroutes);
app.use('/order',orderRoutes);

app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})

mongoose.connect(DB_URL).then((result)=>{
    console.log('succesfully connected to mongodb')
}).catch(err=>{
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', err.message);
    console.error('Full error:', err);
})

