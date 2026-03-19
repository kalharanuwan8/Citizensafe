import mongoose from "mongoose";

const chatlogSchema =  new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    }
}, { timestamps: true });

export default mongoose.models.ChatLog || mongoose.model("ChatLog", chatlogSchema);