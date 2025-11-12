const express = require('express');
const connectDB = require("./config/db")
const User = require("./models/user")

const app = express();

app.use(express.json());

app.post("/signup", async (req,res)=>{
    console.log(req.body);

    try {
        const user = new User (req.body)

    await user.save();
    res.send("User Added Succesfully!")
    } catch (error) {
        res.send("User is not added.")
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

