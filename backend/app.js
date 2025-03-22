import express from "express";
import "dotenv/config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connect from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import cors from 'cors'
connect();

const app = express();

app.use(cors({credentials: true,}))
app.use(cookieParser())
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});


export default app;
