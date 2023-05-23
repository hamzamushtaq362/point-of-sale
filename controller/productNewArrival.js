const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const Product = require('../models/addproductmodel');

exports.newArrival = async function  (req, res) {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const storeId= req.store;
    // const prodstore= await Product.find({store_id });
    // if(storeId != prodstore){
    //     ( err => res.status(400).json({ msg: 'Store Id is not correct', error: err }))
    //   }else{
    // console.log("Hamza your here:" dateAdded);
   await Product.find({ dateAdded: { $gte: sevenDaysAgo }, store_id: storeId, })
    .sort({ dateAdded: 'desc' }).limit(config.test.NewArrival)
    .then(products => res.json(products.reverse())  )
    .catch(err => res.status(400).json({ msg: 'Error retrieving new arrivals', error: err }));
};