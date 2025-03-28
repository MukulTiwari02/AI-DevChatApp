import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authUser,
  body("name").isString().withMessage("Project name should be a string"),
  projectController.createProjectContoller
);

router.get("/allProjects", authUser, projectController.getAllProjectsController);

router.put('/addUser', authUser, projectController.addUserToProjectController);

router.get("/getProject/:projectId", projectController.getProjectByIdController);

router.put('/update-fileTree', authUser, projectController.updateFileTreeController);

export default router;
