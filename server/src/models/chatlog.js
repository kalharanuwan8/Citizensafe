import mongoose from "mongoose";

const chatlogSchema =  new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: tru
    }
})