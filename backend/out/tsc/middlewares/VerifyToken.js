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
exports.AdminMiddleware = exports.VerifyCreatorToken = exports.VerifyToken = void 0;
const UserModel_1 = require("../models/UserModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Constant_1 = require("../constants/Constant");
const chalk_1 = __importDefault(require("chalk"));
const VerifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["auth-token"];
        // @ts-expect-error aaa
        let user = yield UserModel_1.User.findByToken(token);
        if (!user)
            throw new Error("Unauthorized");
        req.user = user;
        next();
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Unauthorized", status: false });
    }
});
exports.VerifyToken = VerifyToken;
const VerifyCreatorToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["auth-token"];
        // @ts-expect-error aaa
        let user = yield UserModel_1.User.findByToken(token);
        if (!user || (user === null || user === void 0 ? void 0 : user.role) !== UserModel_1.USER_ROLE.CREATOR)
            throw new Error("Unauthorized");
        req.user = user;
        next();
    }
    catch (err) {
        console.log(chalk_1.default.red(err));
        res.json({ message: "Unauthorized", status: false });
    }
});
exports.VerifyCreatorToken = VerifyCreatorToken;
const AdminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers["auth-token"];
        // @ts-expect-error aaa
        const decode = jsonwebtoken_1.default.verify(token, Constant_1.secret);
        const admin = yield UserModel_1.User.findOne({ _id: decode._id });
        if (!admin || admin.role !== UserModel_1.USER_ROLE.ADMIN)
            res.status(404).json({ message: "Unauthorized", status: false });
        // @ts-expect-error aaa
        req.user = admin;
        next();
    }
    catch (error) {
        console.log(chalk_1.default.red(error));
        res.status(500).json({ message: "Server Error", status: false });
    }
});
exports.AdminMiddleware = AdminMiddleware;
