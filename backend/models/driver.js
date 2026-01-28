const mongoose = require('mongoose');
const{Schema} = mongoose;
const bcrypt = require('bcrypt');

const driverSchema = new Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    phonenumber:{
        type:String
    },
    vehicle:{
        type:String
    },
    isOpen:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        default:'driver'

    },

});

driverSchema.pre("save",async function(next) {
    const driver = this;
    if(!driver.isModified('password')) return next();
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(driver.password, salt);
    driver.password = hash
    
});

driverSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password,this.password);
    
}

const Driver = mongoose.model("Driver",driverSchema);
module.exports = Driver;