import express from 'express'
import { createDisaster, getAllDisasters, getNearByDisasters, getDisasterByID, updateAdminDisasterConfirmation, deleteDisasterbyadmin, confirmDisasterByUser } from '../controllers/disasterController.js';
import { get } from 'mongoose';
import { protect, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/",protect, createDisaster);
router.get("/",protect, getAllDisasters);
router.get("/nearby",protect, getNearByDisasters);
router.get("/:id",protect, getDisasterByID);
router.put("/:id", protect, authorizeAdmin, updateAdminDisasterConfirmation);
router.delete("/:id", protect, authorizeAdmin, deleteDisasterbyadmin);
router.patch("/confirm/:id", protect, confirmDisasterByUser);

export default router;