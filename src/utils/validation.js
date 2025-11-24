const validator = require('validator');

const validateSignupData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){        
        if(firstName.length <1 || firstName.length > 50){
            throw new Error("First Name should have at least 2-49 letters.");
        }
        else if(firstName.length <1 || firstName.length > 50){
            throw new Error("First Name should have at least 2-49 letters.");
        }
        throw new Error("Enter Both First Name and Last Name.");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("ENTER STRONG PASSWORD!");
    }
}

const validateProfileEditData = (req) =>{
    const allowedEditFields = ["firstName","lastName","age","photoUrl","gender","about","skills"];
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports= {
    validateSignupData,
    validateProfileEditData,
};