import User from '../models/user.js';
import Disaster from '../models/disaster.js';
import Alert from '../models/alerts.js';

export const getAllUsers = async () => {
    return await User.find().select('-password');
};

export const verifyDisaster = async (disasterId) => {
    return await Disaster.findByIdAndUpdate(disasterId, { status: 'Active' }, { new: true });
};
