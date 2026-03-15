import mongoose, { trusted } from "mongoose";

const alertSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    location:{
        type:{
            type: String,
            enum: ["Point"],
            default: "point"
        },
        coordinates: {
            type:["Number"],
            required: true
        }
    },
    severity:{
        type:String,
        enum: ["critical", "medium", "low"],
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type:String,
        enum:["Active", "Solved"]
    },
    expiresAt:
    {
        type: date
    }
},
{
    timestamps: true
}
)
alertSchema.index({location: "2dsphere"});
export default mongoose.model("Alert", alertSchema);