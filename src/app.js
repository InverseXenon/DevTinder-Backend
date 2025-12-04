const express = require('express');
const connectDB = require("./config/db")
const cookieParser = require("cookie-parser")
const cors = require("cors");

const app = express();
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB().then(()=>{
    console.log("Database connection established....");
    app.listen(3000,()=>{
    console.log("Server is running on Port 3000.")
})
}).catch((err)=>{
    console.log("Database cannot be connected.")
})

