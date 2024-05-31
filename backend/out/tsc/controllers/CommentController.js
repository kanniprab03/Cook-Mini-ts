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
exports.GetComment = exports.NewComment = void 0;
const RecipeModel_1 = require("../models/RecipeModel");
const CommentsModel_1 = require("../models/CommentsModel");
const UserModel_1 = require("../models/UserModel");
const chalk_1 = __importDefault(require("chalk"));
// New Comment
const NewComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { comment } = req.body;
        const user = req === null || req === void 0 ? void 0 : req.user;
        if (!user)
            return res.json({ status: false, message: "You are not authorized to perform this action" });
        if (!comment)
            return res.json({ message: "Comment is required", status: false });
        const recipe = yield RecipeModel_1.Recipe.findById(req.params.id);
        if (!recipe)
            return res.json({ message: "Recipe not found", status: false });
        const isComment = yield CommentsModel_1.Comment.findById(recipe === null || recipe === void 0 ? void 0 : recipe.commentId);
        if (!isComment) {
            const newComment = new CommentsModel_1.Comment({ comments: [{ comment, userId: user === null || user === void 0 ? void 0 : user._id }], userId: user === null || user === void 0 ? void 0 : user._id });
            yield newComment.save();
            yield RecipeModel_1.Recipe.findByIdAndUpdate(recipe._id, { commentId: newComment._id });
            const oldComment = yield CommentsModel_1.Comment.findById(newComment._id);
            const arr = (_a = oldComment === null || oldComment === void 0 ? void 0 : oldComment.comments) === null || _a === void 0 ? void 0 : _a.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield UserModel_1.User.findById(comment.userId);
                return Object.assign(Object.assign({}, comment), { userName: user === null || user === void 0 ? void 0 : user.name });
            }));
            return res.json({ message: "Comment created", status: true, comments: yield Promise.all(arr) });
        }
        else {
            yield CommentsModel_1.Comment.findByIdAndUpdate(recipe.commentId, { $push: { comments: { comment, userId: user === null || user === void 0 ? void 0 : user._id } } });
            const oldComment = yield CommentsModel_1.Comment.findById(isComment._id);
            const arr2 = (_b = oldComment === null || oldComment === void 0 ? void 0 : oldComment.comments) === null || _b === void 0 ? void 0 : _b.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield UserModel_1.User.findById(comment.userId);
                return Object.assign(Object.assign({}, comment), { userName: user === null || user === void 0 ? void 0 : user.name, profileImg: user === null || user === void 0 ? void 0 : user.profileImg });
            }));
            return res.json({ message: "Comment created", status: true, comments: yield Promise.all(arr2) });
        }
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.status(500).json({ message: "Internal Error" });
    }
});
exports.NewComment = NewComment;
// Fetch Comment By Id
const GetComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { id } = req.params;
        if (!id || id === undefined)
            return res.json({ status: false, message: "Something went wrong" });
        const isComment = yield CommentsModel_1.Comment.findById(id);
        if (!isComment)
            return res.json({ status: false, message: "Comment not found" });
        const arr = (_c = isComment === null || isComment === void 0 ? void 0 : isComment.comments) === null || _c === void 0 ? void 0 : _c.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UserModel_1.User.findById(comment.userId);
            const obj = Object.assign(Object.assign({}, comment), { userName: user === null || user === void 0 ? void 0 : user.name, profileImg: user === null || user === void 0 ? void 0 : user.profileImg });
            return obj;
        }));
        res.json({ status: true, comments: yield Promise.all(arr), message: "Comment Found" });
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Internal Error", status: false });
    }
});
exports.GetComment = GetComment;
