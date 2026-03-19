import User from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async({firstName, lastName, email, password}) =>
{
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    const existinguser = await User.findOne({email});
    if(existinguser) throw new Error("Email already exists");

    const user = new User ({firstName, lastName,email, password});
    return await user.save();
    
}

export const loginUser = async ({email, password}) =>
{
    const user = await User.findOne({email});
    if(!user) throw new Error("Invalid email or password");
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error("Invalid email or password");

    const token = jwt.sign(
            {id:user._id, 
            role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1d'});
            
        const userData = {
            id: user._id,
            email: user.email,
            role: user.role,
            homeLocation: user.homeLocation,
            isNewUser: user.isNewUser
        };

        if (user.isNewUser) {
            user.isNewUser = false;
            await user.save();
        }
           
        return { user: userData, token };
    
}