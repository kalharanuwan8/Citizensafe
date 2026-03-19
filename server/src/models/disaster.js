import mongoose from "mongoose";

const disasterSchema = new mongoose.Schema ({
    disasterType:{
        type: String,
        enum:["flood", "Landslide", "Accident", "Fire", "earthquake", "power_outage", "other"],
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    location:{
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    image:{
        url: String,
        key:String
    },
    confirmationCount: {
        type: Number,
        default: 0
    },
    status:{
      type: String,
      enum: ["Active", "Solved", "False", "Unverified"] ,
      default: "Unverified"
    }

},
{
    timestamps: true
}

)
disasterSchema.index({location: "2dsphere"});
export default mongoose.models.disaster || mongoose.model("disaster", disasterSchema);