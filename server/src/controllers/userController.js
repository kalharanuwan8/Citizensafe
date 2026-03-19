import * as userService from '../services/userService.js';

export async function getUserProfile(req, res) {
    try {
        const userId = req.user.id;
        const user = await userService.getUserProfile(userId);
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

export async function updateUserProfile(req, res) {
    try {
        const userId = req.user.id;
        // Only allow updating certain fields, e.g. profileImage, maybe names. Here focusing on profileImage.
        const { profileImage, firstName, lastName, homeLocation, alertRadius } = req.body;
        
        const updateData = {};
        if (profileImage !== undefined) updateData.profileImage = profileImage;
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (homeLocation !== undefined) updateData.homeLocation = homeLocation;
        if (alertRadius !== undefined) updateData.alertRadius = alertRadius;
        
        const user = await userService.updateUserProfile(userId, updateData);
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

export async function updateFcmToken(req, res) {
    try {
        const userId = req.user.id;
        const { fcmToken } = req.body;
        if (!fcmToken) return res.status(400).json({ error: "fcmToken is required" });
        
        await userService.updateUserProfile(userId, { fcmToken });
        return res.status(200).json({ success: true, message: "FCM token updated" });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
