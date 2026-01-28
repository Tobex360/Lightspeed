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
const DB_URL = process.env.DB_URL;

app.use(cors());
app.use(express.json());


app.use('/user',authUroutes);
app.use('/driver',authDroutes);
app.use('/order',orderRoutes);

mongoose.connect(DB_URL).then((result)=>{
    console.log('succesfully connected to mongodb')
}).catch(err=>{
    console.log('connected to mongo db')
})

app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})