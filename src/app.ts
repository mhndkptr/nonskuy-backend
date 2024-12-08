import express, { Application } from "express";
import cors from "cors";
import router from "./router/route";
require("dotenv").config();

const app: Application = express();

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

app.use(router);

export default app;
