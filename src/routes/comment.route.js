import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    listComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/videos/:videoId/comments").get(listComments).post(verifyJWT, addComment);
router.route("/comments/:commentId").patch(verifyJWT, updateComment).delete(verifyJWT, deleteComment);

export default router;
