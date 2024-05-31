import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { Database } from "./lib/Database";
import { CommentRoute } from "./routes/CommentRoute";
import { RecipeRoute } from "./routes/RecipeRoute";
import { ServerRoute } from "./routes/ServerRoute";
import { UserRouter } from "./routes/UserRoute";
import Logger from "./middlewares/Logger.js";
import chalk from "chalk";

// Required Constants
const port = process.env.PORT || 5500;
const app = express();

// Connect to database
const db = new Database();
db.connect();

// Middlewares
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000", "*"], credentials: true, }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(Logger);

// Default Delay response, to demonstrate server load
app.use((req: Request, res: Response, next: NextFunction) => setTimeout(next, 500));

// Routes
app.use("/api/user", UserRouter);
app.use("/api/comment", CommentRoute);
app.use("/api/server", ServerRoute);
app.use("/api/recipe", RecipeRoute);
app.use("/bucket/server/:imageName", (req, res) => res.sendFile(path.join(path.resolve(), "uploads", "server", req.params.imageName)));
app.use("/bucket/recipes/:imageName", (req, res) => res.sendFile(path.join(path.resolve(), "uploads", "recipes", req.params.imageName)));

// Server Port Listening
app.listen(port, () => console.log(chalk.bgYellow(` Listening on ${port} `)));
