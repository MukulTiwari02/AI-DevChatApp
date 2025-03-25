import { Router } from "express";
import * as aiController from '../controllers/ai.controller.js'

const router = Router();

router.get('/get-response', aiController.getResponseController)

export default router;
