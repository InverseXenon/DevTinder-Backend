const express = require('express');
const connectDB = require("./config/db")
const User = require("./models/user")
const {validateSignupData} = require("./utils/validation")
const bcrypt = require('bcrypt');
const validator = require("validator");

const app = express();

app.use(express.json());

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
            res.send("LOGIN SUCCESSFUL!!!")
        } else {
            throw new Error("INVALID CREDENTIALS!!!")
        }
    }
    catch(err){
        res.status(400).send("ERROR! => " + err);
    }
})

// GET USER by email
app.get("/user", async (req,res)=>{
    const email = req.body.emailId;
    try{
        const user = await User.find({emailId: email});
        if(user.length ===0){
            res.status(400).send("USER NOT FOUND!")
        } else{
            res.send(user)
        }

        
    } catch(err){
        res.status(404).send("SOMETHING WENT WRONG!")
    }
    
})

// Feed API - GET /feed - get all the users form the database
app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({});
    }catch(err){
        res.status(404).send("SOMETHING WENT WRONG!")
    }
})

// DELETE API 
app.delete("/user", async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("USER DELETED SUCCESSFULLY!")
    } catch(err){
        res.status(404).send("SOMETHING WENT WRONG!")
    }
})

// UPDATE 
app.patch("/user/:userId", async (req,res)=>{
    const userId = req.params?.userId; 
    const data = req.body;
    const ALLOWED_UPDATES = [
        "photoUrl","about","gender","age","skills","password"
    ]
    try{
        const isUpdateAllowed = Object.keys(data).every((k)=>{
            return ALLOWED_UPDATES.includes(k);
        })
        if(!isUpdateAllowed){
            throw new Error ("You can't Update this.")
        }
        const user = await User.findByIdAndUpdate(userId,data,{
                runValidators : true,
        }
        );
        res.send("USER UPDATED SUCCESSFULLY")
    } catch(err){
        res.status(400).send("Can't Update the User => " + err)
    }
})

connectDB().then(()=>{
    console.log("Database connection established....");
    app.listen(3000,()=>{
    console.log("Server is running on Port 3000.")
})
}).catch((err)=>{
    console.log("Database cannot be connected.")
})

