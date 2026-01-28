const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

async function registerUser(req,res){
    let {firstname, lastname, username, password, email, address, phonenumber} = req.body;

    try{
        const duplicate = await User.findOne({username});
        if(duplicate){
            return res.status(400).send({message:'username already exists'});
        }
        let user = new User({firstname, lastname, username, password, email, address, phonenumber, role:'user'});
        const result = await user.save();
        console.log(result);
        res.status(200).send({message:'User registered successfully', user: result});
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}

async function loginUser(req,res) {
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).send({message:'Username does not exist'})
        }
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(400).send({message:'Wrong Password'});
        }
        let token = await jwt.sign(
            {
                userId:user?._id,
                role: 'user'
            },secretKey,{expiresIn:'3h'});
        let finalData = {
            userid:user?._id,
            username:user?.username,
            firstname:user?.firstname,
            lastname:user?.lastname,
            email:user?.email,
            address:user?.address,
            phonenumber:user?.phonenumber,
            role: 'user',
            token
        }
        res.send(finalData)

    }catch(err){
        console.log(err);
        res.status(400).send(err)
    }
    
}

async function editUser(req,res) {
    try{
        const{id} = req.params;
        const updateData = req.body;
        
        const result = await User.findByIdAndUpdate(id, updateData, {new: true});
        
        if(!result) {
            return res.status(404).send({message:'User not found'});
        }
        
        const updatedData = {
            userid:result?._id,
            username:result?.username,
            firstname:result?.firstname,
            lastname:result?.lastname,
            email:result?.email,
            address:result?.address,
            phonenumber:result?.phonenumber,
            role: result?.role
        }
        
        res.send({message:'Profile updated successfully', user: updatedData});
    }catch(err){
        console.log(err);
        res.status(400).send({message:'Error updating profile', error: err.message});
    }
    
}

async function getUserByUsername(req,res) {
    try{
        const {username} = req.params;
        const user = await User.findOne({username});
        
        if(!user) {
            return res.status(404).send({message:'User not found'});
        }
        
        res.send({user: {_id: user._id, username: user.username, firstname: user.firstname, lastname: user.lastname}});
    }catch(err){
        console.log(err);
        res.status(400).send({message:'Error fetching user', error: err.message});
    }
}

const AuthUcontroller = {
    registerUser,
    loginUser,
    editUser,
    getUserByUsername,
}

module.exports = AuthUcontroller;
