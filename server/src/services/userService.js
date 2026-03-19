import User from '../models/user.js';

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

export const updateUserProfile = async (userId, updateData) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
