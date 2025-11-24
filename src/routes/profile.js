const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const bcrypt = require('bcrypt');


const profileRouter = express.Router();

// GET /profile API 
profileRouter.get("/profile/view",userAuth ,async (req,res)=>{
    try {
        const user = req.user;
        res.send(user);        
    } catch (error) {
        res.status(400).send(error)
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{

    try {
        if(!validateProfileEditData(req)){
            throw new Error("INVALID EDIT REQUEST!");
        }
        const loggedInUser = req.user;
        
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]= req.body[key]));
        await loggedInUser.save();

        res.json({message: `${loggedInUser.firstName}, your Profile is updated Sucessfully!`,
            data: loggedInUser
        }
        );
    } catch (error) {
        res.status(400).send("Error: "+ error);
    }
})

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
    try {
        const {newPassword} = req.body;
        const user = req.user;
        const newHashedPassword = await bcrypt.hash(newPassword,10);
        user.password = newHashedPassword;
        await user.save();
        console.log(newHashedPassword);
        res.send("Password Updated Successfully!");
    } catch (error) {
        
    }
})

module.exports = profileRouter;