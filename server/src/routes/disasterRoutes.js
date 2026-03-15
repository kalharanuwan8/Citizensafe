import express from 'express'
import { createDisaster, getAllDisasters, getNearByDisasters, getDisasterByID, updateAdminDisasterConfirmation, deleteDisasterbyadmin } from '../controllers/disasterController.js';
import { get } from 'mongoose';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/",protect, createDisaster);
router.get("/",protect, getAllDisasters);
router.get("/nearby",protect, getNearByDisasters);
router.get("/:id",protect, getDisasterByID);
router.put("/:id",protect, updateAdminDisasterConfirmation);
router.delete("/:id", protect ,deleteDisasterbyadmin);

export default router;