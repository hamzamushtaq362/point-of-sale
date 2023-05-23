const { validationResult } = require('express-validator');
const users = require('../models/users');
const store = require('../models/storeModel');
const Product = require("../models/addproductmodel");
const roleModel = require("../models/role");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
 cloud_name: "abdul-basit",
 api_key: "745415375475247",
 api_secret: "hoNCncp6wNz-MZ4qTenDf9VUBOY",
 secure: true,
});


//add store
exports.addStore = async function (req, res) {
  console.log("add store");
 let success = false;
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
 }
 try {
  console.log("try");
    // Custom access code
    // let permission = await roleModel
    // .findOne({ _id: req.access })
    // .populate({ path: "permission_id" 
    // });
    // console.log("search Product Details");
    // console.log(permission.permission_id.storeAdd);
  // console.log(req.access);
  if(req.access.storeAdd){
   const { branchName, storePhone, storeAddress } = req.body;
    
   console.log(req.user);
   let admin = await users.findOne({ email: req.user });
   if (!admin) {
     return res.status(400).json({ success, error: "Sorry admin not found!" })
   }

   const Store = await store.create({
     storeName: admin.company,
     ownerId: admin._id,
     branchName: branchName,
     storePhone: storePhone,
     storeAddress: storeAddress,

   })


   success = true;
   return res.json({ success, Store });
  }else{
    return res.status(401).json("you have no access for this route");

  }
 } catch (error) {
   return res.status(401).json("Some error occured");
 }
}





exports.getStore = async function (req, res) {
 let success = false;
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ success, errors: errors.array() });
 }
 try {
  // console.log("get store funciton first IF");
  // console.log("access",req.access);
  // console.log("access.storeAdd",req.access.storeAdd);
  if(req.access){


   let admin = await users.findOne({ email: req.user });
   if (!admin) {
     return res.status(400).json({ success, error: "Sorry admin not found!" })
   }

   let storeName = admin.company;
   let stores = await store.find({ ownerId: admin._id });
   if(!stores){
     return res.status(404).json({ success, error: "Sorry, stores not found!" })
   }
   
   success = true;
   return res.json({ success, stores,storeName: storeName });
  }
  else{
    return res.status(401).json("you have no access for this route");
  }
 } catch (error) {
   return res.status(401).json("Not authorized");
 }
};


exports.getSingleStore = async function (req, res) {

 let success = false;
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ success, errors: errors.array() });
 }
 try {
  if(req.access.storeView){

   let admin = await users.findOne({ email: req.user });

   if (!admin) {
     return res.status(401).json({
       message: "Unauthorized"
     })
   }


   if (admin.status !== "active") {
     return res.status(403).json({
       message: "You are not active to access store"
     })
   }

   let singleStore = await store.findById(req.params.id);

   if (!singleStore) {
     return res.status(400).json({ success, error: "Sorry store not found!" })
   }
   success = true;
   return res.json({ success, singleStore });
  }  else{
    return res.status(401).json("you have no access for this route");
  }
 } catch (error) {
   return res.status(401).json("Some error occured");
 }
}


exports.deleteSingleStore = async function (req, res) {

 let success = false;
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ success, errors: errors.array() });
 }
 // Check wheather the user with this email already exist
 try {
  if(req.access.storeDelete){


   let admin = await users.findOne({ email: req.user });

   if (!admin) {
     return res.status(401).json({
       message: "Unauthorized"
     })
   }

   if (admin.status !== "active") {
     return res.status(403).json({
       message: "You are not active to access store"
     })
   }

   let deletedStore = await store.findById(req.params.id);

   if (!deletedStore) {
     return res.status(400).json({ success, error: "Sorry store not found!" })
   }

   let products = await Product.find({store_id:req.params.id});
   if(!products){
     return res.status(401).json({ success, error: " unauthorized!" })
   }

   
   products.forEach(a => {
     cloudinary.uploader.destroy(a.image_no, function (result) {
       return res.status(200).json({ success,result, message: "Image delete" })
   })

 })

 
   let deletedProducts = await Product.deleteMany({store_id: req.params.id})

   if(!deletedProducts){
     return res.status(400).json({ success, error: "Sorry products not found!" })
   }

   deletedStore = await store.findByIdAndDelete(deletedStore);
   
   if(!deletedStore){
     return res.status(400).json({ success, error: "Sorry store not found!" })
   }
   success = true;
   return res.json({ success, deletedStore, deletedProducts });
  }
  else{
    return res.status(401).json("you have no access for this route");
  }
 } catch (error) {

  return res.status(401).json("Some error occured");
 }
}
