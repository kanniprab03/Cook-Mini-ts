import { Router } from "express"
import path from "path"
import { GetComment, NewComment } from "../controllers/CommentController"
import { VerifyToken } from "../middlewares/VerifyToken"

const route = Router()
route.get("/get/:id", GetComment)
route.post("/insert/:id", VerifyToken, NewComment)
route.get("/bucket/:fileName", (req, res) => { res.sendFile(path.join(path.resolve(), "uploads", "server", req.params.fileName)) })

export { route as CommentRoute }