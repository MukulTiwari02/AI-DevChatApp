import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register",
    body('email').isEmail().withMessage("Email must be a valid email address"),
    userController.createUserController);

    router.post("/login",
    body('email').isEmail().withMessage("Email must be a valid email address"),
    userController.loginController);

    router.get('/profile', authUser, userController.profileController)
    
    router.get('/logout',  userController.logoutController)

export default router;
