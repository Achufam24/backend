const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');


const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    referralCode: {
        type: String,
        required: false
    }
});

//static signup method
userSchema.statics.signup =  async function (payload){
    console.log(payload);
    

    //validation
    if (!payload.email || !payload.password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(payload.email)) {
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(payload.password)) {
        throw Error('Password not strong enough')
    }

    const exists = await this.findOne({email: payload.email})

    if (exists) {
        throw Error('Email already in use')
    }

    const phoneNumberExists = await this.findOne({phoneNumber: payload.phoneNumber});

    if(phoneNumberExists){
        throw Error("Phone number already in use");
    }
    // const salt = await bcrypt.genSalt(10)
    // const hash = await bcrypt.hash(payload.password, salt)
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    console.log(hashedPassword);
    

    const user = await this.create({
        ...payload,
        password:hashedPassword
    })

    return user
}

//static signup method
userSchema.statics.login = async function (email,password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    const user = await this.findOne({email});
    console.log(user);
    

    if (!user) {
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('incorrect password')
    }
    return user;
}

module.exports = mongoose.model('User',userSchema);