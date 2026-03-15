import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    points: {
        type: Number,
        default: 0
    },
    verifiedBadge: {
        type: Boolean,
        default: false
    },
    homeLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            
        }
    },
    alertRadius:{
        type: Number,
        default: 5,
        min: 5,
        max: 20
    },
    currentLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            
        }
    },         
}, 
    {
        timestamps: true
    }
)
 userSchema.index({currentlocation: "2dsphere"});  
 userSchema.index({homelocation: "2dsphere"})

userSchema.pre('save', async function () {
    if(!this.isModified('password')) 
        return ;
    this.password = await bcrypt.hash(this.password, 12);

});

export default mongoose.model("User", userSchema);
