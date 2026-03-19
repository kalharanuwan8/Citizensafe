import admin from "firebase-admin";

admin.initializeApp();

export const sendNotificationToAll = async (title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    topic: 'alerts', // broadcast topic
  };

  try {
    await admin.messaging().send(message);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
