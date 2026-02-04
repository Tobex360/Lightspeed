const { message } = require('antd');
const Driver = require('../models/driver');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

async function registerDriver(req,res){
    let {firstname, lastname, username, password, email, address, phonenumber, vehicle, isOpen} = req.body;

    try{

        const duplicate = await Driver.findOne({username});
        if(duplicate){
            return res.status(400).send({message:'username already exists'});
        }
        let driver = new Driver({
                    firstname,
                    lastname,
                    username,
                    password,
                    email,
                    address:{
                        street:address.street,
                        city:address.city,
                        state:address.state
                    },
                    phonenumber,
                    vehicle,
                    isOpen,
                    role:'driver'});
        // let driver = new Driver({firstname, lastname, username, password, email, address, phonenumber, vehicle, isOpen, role:'driver'});
        const result = await driver.save();
        console.log(result);
        res.status(200).send({message:'Driver registered successfully', user: result});
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
    
}

async function loginDriver(req,res) {
    try{
        const {username, password} = req.body;
        const driver = await Driver.findOne({username});
        if(!driver){
            return res.status(400).send({message:'Username does not exist'});
        }
        const isPasswordValid = await driver.comparePassword(password);
        if(!isPasswordValid){
            return res.status(400).send({message:'Wrong Password'});
        }
        let token = await jwt.sign(
            {
                userId:driver?._id,
                role: 'driver'

            },secretKey,{expiresIn:'3h'});
        let finalData = {
            userid:driver?._id,
            username:driver?.username,
            firstname:driver?.firstname,
            lastname:driver?.lastname,
            email:driver?.email,
            address:driver?.address,
            phonenumber:driver?.phonenumber,
            vehicle:driver?.vehicle,
            role: 'driver',
            token
        }
        res.send(finalData)
    }catch(err){
        console.log(err);
        res.status(400).send(err)
    }
    
}
// async function editDriver(req,res) {
//     try{
//         const{id} = req.params;
//         const updateData = req.body;
        
//         const result = await Driver.findByIdAndUpdate(id, updateData, {new: true});
        
//         if(!result) {
//             return res.status(404).send({message:'User not found'});
//         }
        
//         const updatedData = {
//             userid:result?._id,
//             username:result?.username,
//             firstname:result?.firstname,
//             lastname:result?.lastname,
//             email:result?.email,
//             address:result?.address,
//             phonenumber:result?.phonenumber,
//             vehicle:result?.vehicle,
//             role: result?.role
//         }
        
//         res.send({message:'Profile updated successfully', user: updatedData});
//     }catch(err){
//         console.log(err);
//         res.status(400).send({message:'Error updating profile', error: err.message});
//     }
    
//
async function editDriver(req, res) {
    try {
        const { id } = req.params;
        const {
            firstname,
            lastname,
            username,
            email,
            phonenumber,
            vehicle,
            address
        } = req.body;

        const updateData = {};

        if (firstname) updateData.firstname = firstname;
        if (lastname) updateData.lastname = lastname;
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (phonenumber) updateData.phonenumber = phonenumber;
        if (vehicle) updateData.vehicle = vehicle;


        if (address) {
            updateData.address = {};
            if (address.street) updateData.address.street = address.street;
            if (address.city) updateData.address.city = address.city;
            if (address.state) updateData.address.state = address.state;
        }

        const result = await Driver.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!result) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.send({
            message: 'Profile updated successfully',
            user: {
                userid: result._id,
                username: result.username,
                firstname: result.firstname,
                lastname: result.lastname,
                email: result.email,
                address: result.address,
                isOpen: result.isOpen,
                phonenumber: result.phonenumber,
                vehicle: result.vehicle,
                role: result.role
            }
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({
            message: 'Error updating profile',
            error: err.message
        });
    }
}
async function getDrivers(req,res){
    try{
        const drivers = await Driver.find({
            isOpen: true
        }).select('firstname lastname vehicle phonenumber');
        res.json({ drivers })
    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Error fetching drivers', error: err.message });

    }
}


const AuthDcontroller = {
    registerDriver,
    loginDriver,
    editDriver,
    getDrivers,
}

module.exports = AuthDcontroller;