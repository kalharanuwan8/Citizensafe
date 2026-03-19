import admin from "../config/firebase.js";

export const sendNotification = async (token, title, body) => {
    const message = {
        notification: {
            title,
            body
        },
        token
    };
    try {
        await admin.messaging().send(message);
        console.log("Notification sent successfully");
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

export const sendBulkNotification = async (tokens, title, body) => {
    if (!tokens || tokens.length === 0) return;

    const message = {
        notification: {
            title,
            body
        },
        tokens
    };
    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`${response.successCount} notifications sent successfully`);
    } catch (error) {
        console.error("Error sending bulk notification:", error);
    }
};