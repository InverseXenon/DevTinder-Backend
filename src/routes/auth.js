const express = require("express");

const authRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user")

const {validateSignupData} = require("../utils/validation")


authRouter.post("/signup", async (req,res)=>{
    try {
    // Validation
    validateSignupData(req);    
    
    //Encryption of Password
    const { firstName, lastName, emailId, password, age, gender, skills, about, photoUrl } = req.body;
    const hashedPass = await bcrypt.hash(password,10);
    // Creating Instance of the Model
    const user = new User ({
        firstName,
            lastName,
            emailId: emailId.trim(), 
            password: hashedPass,
            age,
            gender,
            skills,
            about,
            photoUrl,
    })

    await user.save();
    res.send("User Added Succesfully!")
    } catch (error) {
        res.send("User is not added => " + error)
    }

    
})

authRouter.post("/login",async (req,res)=>{

    try{
        const {emailId,password} = req.body;
        if(!validator.isEmail(emailId.trim())){
            throw new Error("INVALID CREDENTIALS!!!")
        }
        const user = await User.findOne({emailId : emailId.trim()});
        if(!user){
            throw new Error("INVALID CREDENTIALS!!!")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password );

        if(isPasswordValid){
            //Create a JWT
            const token = await jwt.sign({_id:user._id},"Piyush$##%124",{expiresIn:"1d"}); 
            

            // Add the token to the cookie and send response to the user.

            res.cookie("token", token);
            res.send("LOGIN SUCCESSFUL!!!")
        } else {
            throw new Error("INVALID CREDENTIALS!!!")
        }
    }
    catch(err){
        res.status(400).send("ERROR! => " + err);
    }
})

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    }).send("Logout successful.")
})

module.exports = authRouter;
