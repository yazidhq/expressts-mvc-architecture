import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

import routes from "./routes";
app.use("/api", routes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello!");
});

const port =
  process.env.APP_ENV == "development"
    ? process.env.APP_PORT_DEV
    : process.env.APP_PORT_PROD || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import db from "./models";
db.sequelize.sync({ force: false, alter: true });
