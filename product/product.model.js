import mongoose from "mongoose";

//set schema
const productSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:55,
    },
    brand:{
        type:String,
        required:true,
        trim:true,
        maxlength:55,
    },
    price:{
        type:Number,
        min:0,
        required:true,
    },
    quantity:{
        type:Number,
        min:1,
        required:true,
    },
    category:{
        type:String,
        required:true,
        trim:true,
        enum:['grocery','bakery','liquor','clothing','kitchen','stationary','electronic','electrical','medicines','sports'];

    }
})