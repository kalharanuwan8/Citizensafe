import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Initialize messaging only if supported (requires HTTPS or localhost)
let messaging = null;
const initMessaging = async () => {
  if (await isSupported()) {
    messaging = getMessaging(app);
    return messaging;
  }
  console.warn("Firebase Messaging is not supported in this browser/context.");
  return null;
};

// Start initialization
const messagingPromise = initMessaging();

export const getFirebaseToken = async () => {
  try {
    const msg = await messagingPromise;
    if (!msg) return null;

    const token = await getToken(msg, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });
    return token;
  } catch (error) {
    if (error.code === 'messaging/permission-blocked') {
      console.warn("Notification permission was blocked by the user.");
    } else {
      console.error("Error getting FCM token:", error);
    }
    return null;
  }
};