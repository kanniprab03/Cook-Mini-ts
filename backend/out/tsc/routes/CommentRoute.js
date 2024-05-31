"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoute = void 0;
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const CommentController_1 = require("../controllers/CommentController");
const VerifyToken_1 = require("../middlewares/VerifyToken");
const route = (0, express_1.Router)();
exports.CommentRoute = route;
route.get("/get/:id", CommentController_1.GetComment);
route.post("/insert/:id", VerifyToken_1.VerifyToken, CommentController_1.NewComment);
route.get("/bucket/:fileName", (req, res) => { res.sendFile(path_1.default.join(path_1.default.resolve(), "uploads", "server", req.params.fileName)); });
