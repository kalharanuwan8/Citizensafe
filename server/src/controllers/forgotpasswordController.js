import jwt from 'jsonwebtoken'

export async function forgotpassword(req,res)
{
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
        `http://localhost:5173/reset-password/${resetToken}`;

    // Send email with resetLink

    return res.json({
        message: "Password reset link sent",
        resetLink
    });
}

export async function resetpassword(req,res)
{
    try {
        const {token, password}= req.body;
        const decode = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const user = await User.findById(decode.id)
        if(!user)
            return res.status(404).json({error: "User not found"});
        user.passwordHash = password;
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