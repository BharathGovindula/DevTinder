const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        minLength : 4,
        maxLength : 50
    },

    lastName: {
        type : String
    },

    emailId: {
        type : String,
        lowercase :true,
        required : true,
        unique : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address : " + value)
            }
        }
    },

    password : {
        type : String,
        required : true
    },

    age : {
        type : Number,
        min : 18
    },

    gender : {
        type : String,

        enum : {
            values : ['Male', "Female", "Other"],
            message : `{VALUE} is not a valid gender type`
        }
        // validate(value){
        //     if(!['Male', 'Female', 'Others'].includes(value)){
        //         throw new Error("Gender data is not valid")
        //     }
        // }
    },

    photoUrl : {
        type : String,
        default :"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_incoming&w=740&q=80",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Email address : " + value)
            }
        }
    },

    about : {
        type : String,
        default : "This is a default about of the user"
    },

    skills : {
        type : [String]
    }
},
{timestamps : true});


userSchema.methods.getJWT = async function(){
    const user = this
    const token = await jwt.sign({_id : user._id}, "shhhh", {expiresIn: '7d'})
    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid
}

module.exports = mongoose.model('User', userSchema)