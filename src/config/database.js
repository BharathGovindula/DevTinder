const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://Bharath15:Bharath08@cluster0.p7lqy6l.mongodb.net/DevTinder")
}

module.exports = connectDB