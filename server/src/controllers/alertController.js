import Alert from "../models/alerts.js";
import User from "../models/user.js";
import { sendBulkNotification } from "../utils/fcm.js";

export async function getActiveAlerts(req, res) {
    try {
        const data = await Alert.find({ status: "Active" });
        // Sort by severity: high -> medium -> low
        const severityScores = { high: 3, medium: 2, low: 1 };
        const sortedData = data.sort((a, b) => {
            const scoreDiff = (severityScores[b.severity] || 0) - (severityScores[a.severity] || 0);
            if (scoreDiff !== 0) return scoreDiff;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return res.status(200).json({
            success: true,
            count: sortedData.length,
            data: sortedData
        });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

export const createAlert = async (req, res) => {
    try {
        const { title, message, severity, location } = req.body;

        // 1. Save alert to DB
        const alert = new Alert({
            title,
            message,
            severity: severity || "medium",
            location: location || { type: "Point", coordinates: [79.8612, 6.9271] },
            createdBy: req.user.id,
            status: "Active"
        });
        await alert.save();

        // 2. Get all user tokens
        const users = await User.find({ fcmToken: { $ne: "", $exists: true } });
        const tokens = users.map(user => user.fcmToken).filter(token => !!token);

        // 3. Send push notification if tokens exist
        if (tokens.length > 0) {
            await sendBulkNotification(tokens, title, message);
        }

        // 4. Targeted Socket Emit (Bonus: Location-Based)
        if (req.io) {
            // Find users within 50km of the alert location
            const nearbyUsers = await User.find({
                $or: [
                    {
                        currentLocation: {
                            $near: {
                                $geometry: alert.location,
                                $maxDistance: 50000 // 50km
                            }
                        }
                    },
                    {
                        homeLocation: {
                            $near: {
                                $geometry: alert.location,
                                $maxDistance: 50000 // 50km
                            }
                        }
                    }
                ]
            });

            // Emit specifically to these users
            nearbyUsers.forEach(user => {
                req.io.to(user._id.toString()).emit("new-alert", alert);
            });
            
            // Still emit to general room for admins or global monitoring if needed
            req.io.emit("new-alert", alert); 
        }


        return res.status(201).json({ success: true, data: alert });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};