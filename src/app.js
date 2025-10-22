const express = require("express");
const connectDB = require("./config/database");

const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")

require('dotenv').config()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser())




const authRouter = require("./routes/auth")
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require("./routes/user")


app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)


// app.get('/user', async(req, res)=>{

//   const userEmail = req.body.emailId

//   try{
//     const user = await User.find({emailId : userEmail})
//     if(user.length === 0){
//       res.status(404).send("user not found")
//     }else{

//       res.send(user)

//     }
//   }catch(err){
//       res.status(400).send("Error saving the user:", err.message)
//   }
// })







// app.get('/feed', async(req, res)=>{
//   try{
//     const users = await User.find({})
//     res.send(users)
//   }catch(err){
//     res.status(400).send("something went wrong")
//   }
// })

// app.delete('/user', async(req, res)=>{
//   const userId = req.body.userId

//   try{
//     const user = await User.findByIdAndDelete(userId)
//     res.send("User deleted successfully")
//   }catch(err){
//     res.status(400).send("something went wrong")
//   }
// })


// app.patch('/user/:userId', async(req, res)=>{
//   const userId = req.params?.userId
//   const data = req.body

//   try{
//     const ALLOWED_UPDATES = [ 'photoUrl', 'about', 'gender', 'age', 'skills'];
//     const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key))
//     if(! isUpdateAllowed){
//       throw new Error(" Update not allowed")
//     }

//     if(data?.skills.length > 10){
//       throw new Error('Skills cannot be more than 10')
//     }
//     const user = await User.findByIdAndUpdate(userId, data, {runValidators : true})
//     res.send('User successfully Updated')
//   }catch(err){
//     res.status(400).send("Update Failed :" +  err.message)
//   }
// })

connectDB()
  .then(() => {
    console.log("Database successfully connected");
    app.listen(process.env.PORT, () => {
      console.log("server successfully connected");
    });
  })
  .catch((err) => {
    console.error("Database not connected");
  });
