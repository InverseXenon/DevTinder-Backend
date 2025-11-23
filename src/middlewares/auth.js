const jwt  = require("jsonwebtoken");
const User = require("../models/user");
const e = require("express");

const userAuth = async (req, res, next)=>{
    // Read the token from the req cookies
    
    try {
        const cookies = req.cookies;
        const {token } = cookies;
    if(!token){
        throw new Error("Token is not Valid.")
    }
    const decodedObj = await jwt.verify(token, "Piyush$##%124");
    const {_id} = decodedObj;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("USER NOT FOUND !")
    }
    req.user = user;
    next();
    }

    catch(err){
        res.status(400).send("ERROR: " + err);
    }
    //  Validate the token and find the user.

}

module.exports= {
    userAuth,
}