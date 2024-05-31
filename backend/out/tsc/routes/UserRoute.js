"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const UserController_1 = require("../controllers/UserController");
const RequiredFields_1 = require("./../middlewares/RequiredFields");
const VerifyToken_1 = require("./../middlewares/VerifyToken");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) { cb(null, node_path_1.default.join(node_path_1.default.resolve(), "uploads", "user")); },
    filename: function (req, file, cb) { const unique = Date.now() + "-" + Math.round(Math.random() * 1e9); cb(null, unique + "-" + file.originalname); },
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
exports.UserRouter = router;
router.get("/bucket/:fileName", (req, res) => res.sendFile(node_path_1.default.join(node_path_1.default.resolve(), "uploads", "user", req.params.fileName)));
router.get("/profile", VerifyToken_1.VerifyToken, UserController_1.UserProfile);
router.get("/recipe/saved", VerifyToken_1.VerifyToken, UserController_1.GetSavedRecipes);
router.post("/register", (0, RequiredFields_1.CheckFields)(["name", "email", "password"]), UserController_1.UserRegistration);
router.post("/login", (0, RequiredFields_1.CheckFields)(["email", "password"]), UserController_1.UserLogin);
router.post("/recipe/save/:id", VerifyToken_1.VerifyToken, UserController_1.SaveRecipe);
router.put("/update/name", VerifyToken_1.VerifyToken, UserController_1.UpdateName);
router.put("/update/role", VerifyToken_1.VerifyToken, UserController_1.UpdateUserRole);
router.put("/update/profileImg", VerifyToken_1.VerifyToken, upload.single("profileImg"), UserController_1.UpdateImage);
router.get("/all", VerifyToken_1.AdminMiddleware, UserController_1.AllUsers);
