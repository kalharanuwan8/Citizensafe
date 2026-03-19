import express from 'express';
import { getActiveAlerts } from '../controllers/alertController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", protect, getActiveAlerts);

export default router;
