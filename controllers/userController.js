const User = require('../models/userModel')
const jwt = require('jsonwebtoken');


//create jwt token 
const createToken = (_id) => {
   return jwt.sign({_id}, "owillo", {expiresIn: '3d'})
}

//login user
const Login_user = async(req,res) => {
    const {email,password} = req.body
    try {
        const user = await User.login(email,password)

        //create token
        const token = createToken(user._id)
        
        res.status(200).json({
            status: 201,
            message: "Successful!",
            data: {
                user,
                token
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            error:error.message
        })
    }
}

//signup user
const Signup_user = async(req,res) => {
    //grab email & password from req body
    const {email,password, phoneNumber, firstName, lastName, referrralCode} = req.body

   

    try {
        if (!email) {
            throw Error("email is required")
        }
        if (!password) {
            throw new Error("password is required")
        }
        if(!phoneNumber){
            throw new Error("phoneNumber is required")
        }
    
        if (!firstName) {
            throw new Error("firstName is required")
        }
    
        if (!lastName) {
            throw new Error("lastName is required")
        }
        const user = await User.signup(req.body);

        //create token
        const token = createToken(user._id)
        
        res.status(201).json({
            status: 201,
            message: "Successful!",
            data: {
                user,
                token
            }
            
        })
    } catch (error) {
        res.status(400).json({
            status: 400,
            error:error.message
        })
    }
}

module.exports = {
    Login_user,Signup_user
}