import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.js'

dotenv.config();

export async function forgotpassword(req,res)
{
    try {
        const {email} =req.body;
        const user = await User.findOne({email})
        
        if (!user)
            return res.status(404).json({error:"User Not Found"});
        
        const  resettoken = jwt.sign(
           {id: user._id,},
           process.env.JWT_RESET_SECRET,
           {expiresIn: '5m'}
        );
        
        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password/${resettoken}`;

        // Send email with resetLink (Placeholder)
        console.log("-----------------------------------------");
        console.log(`Password reset link for ${email}:`);
        console.log(resetLink);
        console.log("-----------------------------------------");

        return res.json({
            message: "Password reset link sent to your email",
            resetLink // Included for testing convenience
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}

export async function resetpassword(req,res)
{
    try {
        const {token, password}= req.body;
        const decode = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const user = await User.findById(decode.id)
        
        if(!user)
            return res.status(404).json({error: "User not found"});
        
        // The User model has a pre('save') hook that hashes the password
        user.password = password;
        await user.save();
        
        return res.json({
                message: "Password reset successful"
            });

    } catch (error) {
        return res.status(400).json({
            error: "Invalid or expired token"
        });
    }
}