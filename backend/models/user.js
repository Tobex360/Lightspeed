const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    username:{
        type: String
    },
    password:{
        type: String,
        required:true,
    },
    email:{
        type:String
    },
    address:{
        street: String,
        city: String,
        state: String
    },
    phonenumber:{
        type:String
    },
    role:{
        type:String,
        default:'user'

    },
});

userSchema.pre("save",async function(){
    const user = this;
    if(!user.isModified('password')) return;
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
});

userSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password,this.password);
}

const User = mongoose.model("User", userSchema);
module.exports = User;