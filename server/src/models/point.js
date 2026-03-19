import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    points:{
        type: Number,
        default: 0
    },
    reason:{
        type: String,
        required: true
    },
    referenceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disaster",
        required: true
    }
},
{
    timestamps: true
})
export default mongoose.models.Point || mongoose.model("Point", pointSchema);