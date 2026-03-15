import express from 'express'
import { getUploadUrl } from '../controllers/uploadController.js'

const router = express.Router();
router.get("/", getUploadUrl);

export default router;