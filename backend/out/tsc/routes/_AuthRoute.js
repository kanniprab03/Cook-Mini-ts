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
exports.AuthRouter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const _VerifyMails_1 = require("../models/_VerifyMails");
const UserModel_1 = require("../models/UserModel");
const route = (0, express_1.Router)();
exports.AuthRouter = route;
route.get("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-expect-error
        const decode = jsonwebtoken_1.default.verify(req.query.token, "idfl jnmr urik vtck");
        const isVerify = yield _VerifyMails_1.Verify.findOne({
            token: req.query.token,
        });
        if (isVerify) {
            if (decode.email === isVerify.email) {
                const user = yield UserModel_1.User.findOne({ email: isVerify.email });
                const updatedUser = yield UserModel_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
                    isVerified: {
                        [isVerify.role]: true,
                    },
                });
                yield (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.save());
                const v = yield _VerifyMails_1.Verify.findOne({ email: user === null || user === void 0 ? void 0 : user.email });
                yield _VerifyMails_1.Verify.findByIdAndDelete(v === null || v === void 0 ? void 0 : v._id);
                res.json({
                    status: true,
                    message: "Successfully Verified",
                });
            }
        }
        res.status(404).end();
    }
    catch (error) {
        res.status(404).end();
    }
}));
