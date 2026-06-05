import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLike, getLikesCount, listLikedVideos } from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle").post(verifyJWT, toggleLike);
router.route("/count").get(getLikesCount);
router.route("/videos").get(verifyJWT, listLikedVideos);

export default router;
