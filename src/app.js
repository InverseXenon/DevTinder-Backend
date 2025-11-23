const express = require('express');
const connectDB = require("./config/db")
const User = require("./models/user")
const {validateSignupData} = require("./utils/validation")
const bcrypt = require('bcrypt');
const validator = require("validator");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res)=>{
    try {
    // Validation
    validateSignupData(req);

    
    
    //Encryption of Password
    const { firstName, lastName, emailId, password, age, gender, skills, about, photoUrl } = req.body;
    const hashedPass = await bcrypt.hash(password,10);
    console.log(hashedPass);
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

app.post("/login",async (req,res)=>{

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
            console.log(token);

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

// GET /profile API 
app.get("/profile",userAuth ,async (req,res)=>{
    try {
        const user = req.user;
        res.send(user);        
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user = req.user;
    console.log("Sending a Connection Req.");
    res.send(user.firstName+" sent a Connection Request Sent!");
})

connectDB().then(()=>{
    console.log("Database connection established....");
    app.listen(3000,()=>{
    console.log("Server is running on Port 3000.")
})
}).catch((err)=>{
    console.log("Database cannot be connected.")
})

