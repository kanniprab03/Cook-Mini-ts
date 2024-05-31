"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRole = exports.UpdateImage = exports.UpdateName = exports.GetSavedRecipes = exports.SaveRecipe = exports.UserProfile = exports.UserLogin = exports.AllUsers = exports.UserRegistration = void 0;
const RecipeModel_1 = require("../models/RecipeModel");
const UserModel_1 = require("./../models/UserModel");
const chalk_1 = __importDefault(require("chalk"));
// New User
const UserRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const isUser = yield UserModel_1.User.findOne({ email });
        if (isUser)
            return res.json({ message: "User Already Registered", status: false });
        const user = new UserModel_1.User({ name, email, password });
        yield user.save();
        yield user.incrementLoginCount();
        res.json({ status: true, message: "User Successfully Registered", });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        ;
        res.json({ status: false, message: "Internal Error" });
    }
});
exports.UserRegistration = UserRegistration;
// All Users for Admin
const AllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserModel_1.User.find();
        res.json({ message: "All Users", status: true, users });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        ;
        res.json({ message: "Internal Error", status: false });
    }
});
exports.AllUsers = AllUsers;
// Authentication
const UserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield UserModel_1.User.findOne({ email });
        if (!user)
            return res.json({ message: "Invalid Credentials", status: false });
        const isMatch = yield user.comparePassword(password);
        if (!isMatch)
            return res.json({ message: "Invalid Credentials", status: false });
        yield user.incrementLoginCount();
        const token = yield user.generateAuthToken();
        res.json({ status: true, message: "Successfully Logged In", user, token });
    }
    catch (err) {
        res.json({ message: "Internal Error", status: false });
    }
});
exports.UserLogin = UserLogin;
// Get Logged In User Information
const UserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.json({ status: true, user: req.user }); });
exports.UserProfile = UserProfile;
;
// Push Recipe Id to User Document
const SaveRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        if (!id)
            return res.json({ status: false, message: "Invalid Recipe Id" });
        const isRecipe = yield RecipeModel_1.Recipe.findById(id);
        if (!isRecipe)
            res.json({ status: false, message: "Recipe not found" });
        if (!(req === null || req === void 0 ? void 0 : req.user))
            return res.json({ message: "User not found", status: false });
        const user = yield UserModel_1.User.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id);
        if ((_b = user === null || user === void 0 ? void 0 : user.savedRecipes) === null || _b === void 0 ? void 0 : _b.includes(id))
            yield UserModel_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { $pull: { savedRecipes: { $in: [id] } } });
        else
            yield UserModel_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { $push: { savedRecipes: id } });
        const afterCheck = yield UserModel_1.User.findById(user === null || user === void 0 ? void 0 : user._id);
        return res.json({ message: (afterCheck === null || afterCheck === void 0 ? void 0 : afterCheck.savedRecipes.includes(id)) ? "Recipe not saved" : "Recipe not saved", status: true, saved: afterCheck === null || afterCheck === void 0 ? void 0 : afterCheck.savedRecipes.includes(id), });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        ;
        res.json({ status: false, message: "Internal Error" });
    }
});
exports.SaveRecipe = SaveRecipe;
// Get All Saved Recipes
const GetSavedRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req === null || req === void 0 ? void 0 : req.user;
        if (!user)
            return res.json({ message: "User not found", status: false });
        const savedRecipes = user === null || user === void 0 ? void 0 : user.savedRecipes.map((recipe) => __awaiter(void 0, void 0, void 0, function* () { return yield RecipeModel_1.Recipe.findById(recipe); }));
        res.json({ message: "Recipes found", status: true, recipes: yield Promise.all(savedRecipes), });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        ;
        res.json({ status: false, message: "Internal Error" });
    }
});
exports.GetSavedRecipes = GetSavedRecipes;
// Update Logged In User Name
const UpdateName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const user = req === null || req === void 0 ? void 0 : req.user;
        if (!user || !name)
            return res.json({ message: "Invalid Parameters", status: false });
        const isUser = yield UserModel_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { name });
        res.json({ status: true, message: "Name updated", user: isUser });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        ;
        res.json({ status: false, message: "Internal Error" });
    }
});
exports.UpdateName = UpdateName;
// Update Logged In User Profile Image
const UpdateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const _id = req.body._id;
        if (!_id)
            return res.json({ message: "Invalid Parameters", status: false });
        const isUser = yield UserModel_1.User.findByIdAndUpdate(_id, { profileImg: (_c = req.file) === null || _c === void 0 ? void 0 : _c.filename, });
        res.json({ status: true, message: "Profile updated", user: isUser, profileImg: (_d = req.file) === null || _d === void 0 ? void 0 : _d.filename, });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        ;
        res.status(500).json({ status: false, message: "Internal Error" });
    }
});
exports.UpdateImage = UpdateImage;
// Update User Role - Admin 
const UpdateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, _id } = req.body;
        const user = req === null || req === void 0 ? void 0 : req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== UserModel_1.USER_ROLE.ADMIN)
            return res.json({ message: "User not found", status: false });
        const isUser = yield UserModel_1.User.findById(_id);
        if (!isUser)
            return res.json({ message: "User not found", status: false });
        yield UserModel_1.User.findByIdAndUpdate(_id, { role });
        res.json({ message: "User role updated", status: true });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        ;
        res.json({ status: false, message: "Internal Error" });
    }
});
exports.UpdateUserRole = UpdateUserRole;
