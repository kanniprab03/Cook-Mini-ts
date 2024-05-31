import jwt from "jsonwebtoken";
import { verify } from "crypto";
import { createTransport } from "nodemailer";
import { Verify } from "../models/_VerifyMails";

const transporter = createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "quantumcelestials@gmail.com",
    pass: "idfl jnmr urik vtck",
  },
});

export const sendRegisterMail = async (email: string) => {
  return new Promise(async (resolve, reject) => {
    const isVerify = await Verify.findOne({ email });
    if (isVerify) {
      return await Verify.findByIdAndDelete(isVerify._id);
    }

    const verify = new Verify({
      email,
      token: jwt.sign({ email }, "idfl jnmr urik vtck"),
    });
    
    const a = await transporter.sendMail({
      from: '"Quantum Celestials" <<EMAIL>>',
      to: email,
      subject: "Welcome to Quantum Celestials",
      text: "Welcome to Quantum Celestials",
      html: RegisterMailBody(
        `http://localhost:5500/api/auth/verify?token=${verify.token}`
      ),
    });

    console.log(a)
    if (a.accepted[0] === email) {
      await verify.save();
      resolve(true);
    } else if (a.rejected[0] === email) {
      reject(false);
    }
  });
};

const ResMailHeader = () => {
  return `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>`;
};

const ResRegisterMailBody = (link: string) => {
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

const RegisterMailBody = (link: string) => {
  return ResMailHeader() + ResRegisterMailBody(link);
};
