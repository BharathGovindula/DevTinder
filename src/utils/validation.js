const validator = require("validator");

const validateSignUpDate = (req) =>{

    const { emailId, password} = req.body;

   
    if(!validator.isEmail(emailId)){
        throw new Error ("Email is not Valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
}


const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field))

    return isEditAllowed
}

module.exports = {validateSignUpDate, validateEditProfileData}