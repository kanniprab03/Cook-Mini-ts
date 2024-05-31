import jwt from "jsonwebtoken";
import { Router } from "express";
import { Verify } from "../models/_VerifyMails";
import { User } from "../models/UserModel";

const route = Router();

route.get("/verify", async (req, res) => {
  try {
    // @ts-expect-error
    const decode = jwt.verify(req.query.token, "idfl jnmr urik vtck");
    const isVerify = await Verify.findOne({
      token: req.query.token,
    });
    if (isVerify) {
      if (decode.email === isVerify.email) {
        const user = await User.findOne({ email: isVerify.email });

        const updatedUser = await User.findByIdAndUpdate(user?._id, {
          isVerified: {
            [isVerify.role]: true,
          },
        });

        await updatedUser?.save();

        const v = await Verify.findOne({ email: user?.email });
        await Verify.findByIdAndDelete(v?._id);

        res.json({
          status: true,
          message: "Successfully Verified",
        });
      }
    }
    res.status(404).end();
  } catch (error) {
    res.status(404).end();
  }
});

export { route as AuthRouter };
