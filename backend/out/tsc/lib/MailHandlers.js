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
exports.sendRegisterMail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = require("nodemailer");
const _VerifyMails_1 = require("../models/_VerifyMails");
const transporter = (0, nodemailer_1.createTransport)({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "quantumcelestials@gmail.com",
        pass: "idfl jnmr urik vtck",
    },
});
const sendRegisterMail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const isVerify = yield _VerifyMails_1.Verify.findOne({ email });
        if (isVerify) {
            return yield _VerifyMails_1.Verify.findByIdAndDelete(isVerify._id);
        }
        const verify = new _VerifyMails_1.Verify({
            email,
            token: jsonwebtoken_1.default.sign({ email }, "idfl jnmr urik vtck"),
        });
        const a = yield transporter.sendMail({
            from: '"Quantum Celestials" <<EMAIL>>',
            to: email,
            subject: "Welcome to Quantum Celestials",
            text: "Welcome to Quantum Celestials",
            html: RegisterMailBody(`http://localhost:5500/api/auth/verify?token=${verify.token}`),
        });
        console.log(a);
        if (a.accepted[0] === email) {
            yield verify.save();
            resolve(true);
        }
        else if (a.rejected[0] === email) {
            reject(false);
        }
    }));
});
exports.sendRegisterMail = sendRegisterMail;
const ResMailHeader = () => {
    return `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>`;
};
const ResRegisterMailBody = (link) => {
    return `<body>
    <title>New Account Registration</title>
    <h2>Welcome to Cook Mini</h2>
    <p>
      Thank you for registering for an account with us. To complete your
      registration, please click the link below:
    </p>
    <p><a href="${link}">Activate account</a></p>
    <p>
      If you did not request this registration, please disregard this email.
    </p>
    <p>Thank you,</p>
    <p>Quantum Celestials</p>
  </body></html>`;
};
const RegisterMailBody = (link) => {
    return ResMailHeader() + ResRegisterMailBody(link);
};
