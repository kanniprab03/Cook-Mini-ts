"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerRoute = void 0;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const route = (0, express_1.Router)();
exports.ServerRoute = route;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(path_1.default.resolve(), "uploads", "server"));
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
route.post("/uploadFile", upload.single("file"), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    res.send(req.file);
});
