import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Project from "./models/project.model.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake?.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;

    if (!projectId) return next("Room id is required.");

    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return next(new Error("Authentication error"));

    socket.project = await Project.findById(projectId);

    socket.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();

  socket.join(socket.roomId);

  socket.on("project-message", (data) => {
    socket.broadcast.to(socket.roomId).emit("project-message", data);
  });

  socket.on("disconnect", () => {
    socket.leave(socket.roomId);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server running on PORT : ", process.env.PORT);
});
