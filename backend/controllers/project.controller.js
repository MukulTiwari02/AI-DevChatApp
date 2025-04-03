import User from "../models/user.model.js";
import * as ProjectService from "../services/project.service.js";
import { validationResult } from "express-validator";

export const createProjectContoller = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name } = req.body;
    const user = await User.findOne({ email: req.user.email });
    const userId = user._id;

    const project = await ProjectService.createProject({ name, userId });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getAllProjectsController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const loggedInUser = await User.findOne({ email: req.user.email });
    const userId = loggedInUser._id;

    const projects = await ProjectService.getAllProjects(userId);
    res.status(200).json({ projects });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const addUserToProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { projectId, users } = req.body;
    const loggedInUser = await User.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const project = await ProjectService.addUserToProject({
      projectId,
      users,
      userId,
    });

    res.status(200).json(project);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getProjectByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { projectId } = req.params;
    const project = await ProjectService.getProjectById({ projectId });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const updateFileTreeController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { projectId, fileTree } = req.body;
  try {
    const project = await ProjectService.updateFileTree({
      projectId,
      fileTree,
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const removeUserFromProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { projectId, userId } = req.body;
    const project = await ProjectService.removeUserFromProject({
      projectId,
      userId,
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
