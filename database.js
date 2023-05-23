const mongoose = require('mongoose');
const mongodb = require("mongodb").MongoClient;
// const mongoURI = "mongodb+srv://hamza:hamza12345@cluster0.qjx93jy.mongodb.net/?retryWrites=true&w=majority";
const mongoURI = "mongodb+srv://umair:shanibhatti@cluster0.ntdjoat.mongodb.net/test";
// const mongoURI = "mongodb+srv://sheraz:sheraz@pos.fbo5ylc.mongodb.net/?retryWrites=true&w=majority";
// const mongoURI = "mongodb+srv://POS-team:abbasi123456@pos-team.mueq0g7.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = (req,res)=>{
    try{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");

    })
}catch(error){
    return res.status(404).json({
        message:"Check your internet connection"
    })
}
}
module.exports = connectToMongo;