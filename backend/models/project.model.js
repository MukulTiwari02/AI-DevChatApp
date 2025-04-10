import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  fileTree: {
    type: Object,
    default: {
      "README.md": {
        file: {
          contents: `"Usage Instructions

To use AI to write code for u, use @ai to give a user prompt and AI will give you the code in the files in fileTree. Specify the file in which you want the AI to write the code.

In case of multiple files, specify all the files.

Example 1: @ai Create an express server using two files, package.json file and a server.js file.

Example 2: @ai Write a js code to add two numbers. Write the code to a add.js file.

Example 3: @ai Write a js code to add two numbers. Write the code to a add.js file and a index.js file."`,
        },
      },
    },
  },
});

const Project = mongoose.model("project", projectSchema);

export default Project;
