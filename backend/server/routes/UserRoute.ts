import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { AllUsers, GetSavedRecipes, SaveRecipe, UpdateImage, UpdateName, UpdateUserRole, UserLogin, UserProfile, UserRegistration } from "../controllers/UserController";
import { CheckFields } from "./../middlewares/RequiredFields";
import { AdminMiddleware, VerifyToken } from "./../middlewares/VerifyToken";

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join(path.resolve(), "uploads", "user")); },
  filename: function (req, file, cb) { const unique = Date.now() + "-" + Math.round(Math.random() * 1e9); cb(null, unique + "-" + file.originalname); },
});
const upload = multer({ storage });

const router = Router();
router.get("/bucket/:fileName", (req, res) => res.sendFile(path.join(path.resolve(), "uploads", "user", req.params.fileName)));
router.get("/profile", VerifyToken, UserProfile);
router.get("/recipe/saved", VerifyToken, GetSavedRecipes);
router.post("/register", CheckFields(["name", "email", "password"]), UserRegistration);
router.post("/login", CheckFields(["email", "password"]), UserLogin);
router.post("/recipe/save/:id", VerifyToken, SaveRecipe);
router.put("/update/name", VerifyToken, UpdateName);
router.put("/update/role", VerifyToken, UpdateUserRole);
router.put("/update/profileImg", VerifyToken, upload.single("profileImg"), UpdateImage);
router.get("/all", AdminMiddleware, AllUsers);

export { router as UserRouter };

