import express from 'express'
import { getUploadUrl, getViewUrl } from '../controllers/uploadController.js'

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get("/", protect, getUploadUrl);
router.get("/view", protect, getViewUrl);

export default router;