import express from 'express';
import { getUserProfile, updateUserProfile, updateFcmToken } from '../controllers/userController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/fcm-token", protect, updateFcmToken);

export default router;
