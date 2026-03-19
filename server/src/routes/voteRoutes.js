import express from 'express'
import confimationbyvote from '../controllers/confirmationController.js'

const router = express.Router();
router.post("/", confimationbyvote);

export default router;
