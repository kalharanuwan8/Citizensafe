import express from 'express'
import { registerUser, loginUser } from '../controllers/authController.js'
import { forgotpassword, resetpassword } from '../controllers/forgotpasswordController.js'

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password", resetpassword);

export default router;