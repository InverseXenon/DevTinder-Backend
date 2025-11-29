const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');



requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"This Status is not possible => "+ status})
        }

        //Check if toUserId exists in Database

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message: "THIS USER IS NOT AVAILABLE."})
        } 

        //Check If Existing Connection Request exists.

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]            
        });
        if(existingConnectionRequest){
            return res.status(400).send("CONNECTION REQUEST ALREADY EXISTS!");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });
    } catch (error) {
        res.status(400).send("Error: "+ error);
    }


    
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res)=>{

    try {
        const loggedInUser = req.user;
        const status = req.params.status;
        //Validate the status
        const allowedStatus = ["accepted", "rejected"];
        if(allowedStatus.includes(status)){
            return res.status(400).json({message: "Status not allowed!"});
        }

        const connectionRequest =  await ConnectionRequest.findOne({
            _id: requestId,
            status: "interested",
            toUserId: loggedInUser._id
        })

        if(!connectionRequest){
            return res.status(404).json({message:"NO REQUEST FOUND!"})
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({message:"Request " + status + " succesfully!",
            data
        })

        // Piyush => Varun (Is the toUserId present)

        //loggedInUser = toUserId

        //status = interested

        // requestId should be valid


    } catch (error) {
        res.status(400).send("Error" + error);
    }
    
})


module.exports = requestRouter;