import mongoose, { trusted } from "mongoose";

const confirmationSchema = new mongoose.Schema({
    disasterId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Disaster",
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    vote:{
        type:String,
        enum: ["fake", "confirm"],
        required: true
    }
},
{
    timestamps: true
})
confirmationSchema.index({disasterId: 1, userId: 1}, {unique: true})
export default mongoose.models.Confirmation || mongoose.model("Confirmation", confirmationSchema);