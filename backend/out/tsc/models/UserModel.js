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
exports.User = exports.encryptPassword = exports.USER_ROLE = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const Constant_1 = require("../constants/Constant");
var USER_ROLE;
(function (USER_ROLE) {
    USER_ROLE["ADMIN"] = "admin";
    USER_ROLE["USER"] = "user";
    USER_ROLE["CREATOR"] = "creator";
    USER_ROLE["GUEST"] = "guest";
})(USER_ROLE || (exports.USER_ROLE = USER_ROLE = {}));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, },
    email: { type: String, required: true, },
    password: { type: String, required: true, },
    role: { type: String, enum: USER_ROLE, required: true, default: USER_ROLE.USER },
    loginCount: { type: Number, default: 1 },
    profileImg: { type: String, },
    savedRecipes: { type: ["String"], default: [] },
}, { timestamps: true });
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.isModified("password"))
            return;
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(user.password, salt);
    });
});
userSchema.method("comparePassword", function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
});
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    return yield bcryptjs_1.default.hash(password, salt);
});
exports.encryptPassword = encryptPassword;
userSchema.method("incrementLoginCount", function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.loginCount++;
        return yield this.save();
    });
});
userSchema.method("generateAuthToken", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ _id: this._id }, Constant_1.secret, {
            expiresIn: "1d",
        });
        return token;
    });
});
userSchema.static("findByToken", function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, Constant_1.secret);
            // @ts-ignore
            const user = yield this.findOne({ _id: decoded._id });
            return user;
        }
        catch (err) {
            throw new Error("Error verifying token: " + err);
        }
    });
});
exports.User = (0, mongoose_1.model)("users", userSchema);
