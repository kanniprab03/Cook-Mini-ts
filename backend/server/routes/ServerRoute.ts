import multer from "multer";
import { Request, Response, Router } from "express";
import path from "path";

const route = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(), "uploads", "server"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});
const upload = multer({ storage });

route.post(
  "/uploadFile",
  upload.single("file"),
  (req: Request, res: Response) => {
    console.log(req.file);
    console.log(req.body);
    res.send(req.file);
  }
);

export { route as ServerRoute };
