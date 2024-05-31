"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const Database_1 = require("./lib/Database");
const CommentRoute_1 = require("./routes/CommentRoute");
const RecipeRoute_1 = require("./routes/RecipeRoute");
const ServerRoute_1 = require("./routes/ServerRoute");
const UserRoute_1 = require("./routes/UserRoute");
const Logger_js_1 = __importDefault(require("./middlewares/Logger.js"));
const chalk_1 = __importDefault(require("chalk"));
// Required Constants
const port = process.env.PORT || 5500;
const app = (0, express_1.default)();
// Connect to database
const db = new Database_1.Database();
db.connect();
// Middlewares
app.use((0, cors_1.default)({ origin: ["http://localhost:5173", "http://localhost:3000", "*"], credentials: true, }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(Logger_js_1.default);
// Default Delay response, to demonstrate server load
app.use((req, res, next) => setTimeout(next, 500));
// Routes
app.use("/api/user", UserRoute_1.UserRouter);
app.use("/api/comment", CommentRoute_1.CommentRoute);
app.use("/api/server", ServerRoute_1.ServerRoute);
app.use("/api/recipe", RecipeRoute_1.RecipeRoute);
app.use("/bucket/server/:imageName", (req, res) => res.sendFile(path_1.default.join(path_1.default.resolve(), "uploads", "server", req.params.imageName)));
app.use("/bucket/recipes/:imageName", (req, res) => res.sendFile(path_1.default.join(path_1.default.resolve(), "uploads", "recipes", req.params.imageName)));
// Server Port Listening
app.listen(port, () => console.log(chalk_1.default.bgYellow(` Listening on ${port} `)));
