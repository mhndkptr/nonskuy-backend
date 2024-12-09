import express, { Application } from "express";
import cors from "cors";
import authRoute from "./routes/authRoute";
import movieRoute from "./routes/movieRoute";
import multer from "multer";
require("dotenv").config();

const app: Application = express();
const upload = multer();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array("files"));

app.use("/api/auth", authRoute);
app.use("/api/movie", movieRoute);

export default app;
