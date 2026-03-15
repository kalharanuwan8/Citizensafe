import User from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async({firstName, lastName, email, password}) =>
{
    const existinguser = await User.findOne({email});
    if(existinguser) throw new Error("User Alredy Exists");

    const user = new User ({firstName, lastName,email, password});
    return await user.save();
    
}

export const loginUser = async ({email, password}) =>
{
    const user = await User.findOne({email});
    if(!user) throw new Error("User does not exists")
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error("Invalid Credentials");

    const token = jwt.sign(
            {id:user._id, 
            role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1d'});
           
        return {user:
            {
                id:user._id,
                email:user.email,
                role:user.role
            }, 
            token};
    
}