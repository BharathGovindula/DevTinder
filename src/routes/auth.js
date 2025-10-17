const express = require('express')

const authRouter = express.Router()
const User = require('../model/User')
const bcrypt = require("bcrypt")
const {validateSignUpDate} = require('../utils/validation')

authRouter.post('/signup', async(req, res)=>{
  
  try{

    //validation of data

    validateSignUpDate(req)


    //Encrypt the password

    const { firstName,lastName, emailId, password} = req.body;

    const passwordHash = await bcrypt.hash(password, 10)
    

    // creating a new instance of  the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password : passwordHash
    })


    const savedUser = await user.save()

    const token = await savedUser.getJWT();
      
      res.cookie("token", token, {expires: new Date(Date.now() + 8 + 3600000)})

    res.json({message : "User Added Successfully!", data: savedUser})
    }
    catch(err){
      res.status(400).send("Error : " + err.message)
    }
})




authRouter.post('/login', async (req, res)=>{
  try{
    //add email validation - I'm skipping here 


    const {emailId, password} = req.body;
    //checking user is already present or not?

    const user = await User.findOne({emailId : emailId})
    if(!user){
      throw new Error("Invalid Credentials")
    }

    // shifted to userSchema
    // const isPasswordValid = await bcrypt.compare(password, user.password)
 
    const isPasswordValid = await user.validatePassword(password)

    if(isPasswordValid){
      //create a JWT token


      // shifted to userSchema bcoz this method is vely closely related to user, every user will have a different JWT token, that's why we are offloading it too userSchema
      // const token = await jwt.sign({_id:user._id},"shhhh",{expiresIn: "1d"})
      // console.log(token);

      const token = await user.getJWT();
      
      res.cookie("token", token, {expires: new Date(Date.now() + 8 + 3600000)})
      res.send(user)
    }else{
      throw new Error("Invalid Credentials");
      
    }
  }catch(err){
      res.status(400).send("Error : " + err.message)
    }
})


authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now())})
    res.send("Logout Successfull!!")
})

module.exports = authRouter