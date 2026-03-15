import express from 'express'
import confimationbyvote from '../controllers/confirmationController'

const router = express.Router();
app.use("/", confimationbyvote);

export default router;
