import Project from "../models/project.model.js";

export const createProject = async ({ name, userId }) => {
  if (!name) throw new Error("Project name is required");

  if (!userId) throw new Error("User is required");

  try {
    const project = await Project.create({
      name,
      users: [userId],
    });

    return project;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name already exists");
    } else {
      throw error;
    }
  }
};

export const getAllProjects = async (userId) => {
  if (!userId) throw new Error("UserId is required");

  const allUserProjects = await Project.find({
    users: userId,
  });

  return allUserProjects;
};

export const addUserToProject = async ({ projectId, users, userId }) => {
  if (!projectId) throw new Error("Project id is required");
  if (!userId) throw new Error("User id is required");
  console.log(users);
  if (!Array.isArray(users))
    throw new Error("Users must be an array of strings of mongoose id");

  const project = await Project.findOne({ _id: projectId, users: userId });

  if (!project) throw new Error("User does not belong to this project.");

  const updatedProject = await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: { $each: users },
      },
    },
    { new: true }
  );

  return updatedProject;
};

export const removeUserFromProject = async ({ projectId, userId }) => {
  if (!projectId) throw new Error("Project id is required");
  if (!userId) throw new Error("User id is required");

  const project = await Project.findOne({ _id: projectId, users: userId });
  if (!project) throw new Error("User does not belong to this project.");

  let updatedProject = await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $pull: {
        users: userId,
      },
    },
    { new: true }
  );
  if(updatedProject.users.length === 0)
    updatedProject = await Project.findByIdAndDelete(projectId);

  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  if (!projectId) throw new Error("Project id is required");
  const project = await Project.findById(projectId);
  return project;
};

export const updateFileTree = async ({ projectId, fileTree }) => {
  if (!projectId) throw new Error("Project id is required");
  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      fileTree,
    },
    { new: true }
  );

  return project;
};
