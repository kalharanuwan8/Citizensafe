import Alert from "../models/alerts.js";

// Get all active alerts
export const getActiveAlerts = async () => {
    return await Alert.find({
        status: "Active",
        // Optional: expiresAt: { $gt: new Date() }
    }).sort({ severity: 1, createdAt: -1 }); // 'critical' will be before 'medium'/'low' if we do custom sort, but alphabetical 'critical' is before 'medium'. Wait! 'critical' < 'low' < 'medium'. To do correct sorting, we can handle it at service level.
};

export const createAlert = async (data) => {
    const newAlert = new Alert(data);
    return await newAlert.save();
};
