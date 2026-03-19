import express from 'express';
import { getDisasters, verifyDisaster, createAlert, getUsers } from '../controllers/adminController.js';
import { protect, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, authorizeAdmin); // Apply to all admin routes

router.get("/disasters", getDisasters);
router.post("/disasters/:id/verify", verifyDisaster);
router.post("/alerts", createAlert);
router.get("/users", getUsers);

export default router;
