const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI=process.env.MONGO_URI 
// Set strictQuery to suppress Mongoose 7 warning
mongoose.set('strictQuery', true);
const connectDb=async ()=>{
  try {
    await mongoose.connect(MONGO_URI).then((data)=>{
        console.log(`DATABASE CONNECTED WITH ${data.connections[0].name}`);
    });
  } catch (error) {
    console.log(error.Message);
    setTimeout(connectDb,5000);
  }
  
}
module.exports = connectDb;
