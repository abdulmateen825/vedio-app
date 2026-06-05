import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, optionalAuth } from "../middlewares/auth.middleware.js";
import {
    createVideo,
    listVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublish
} from "../controllers/video.controller.js";

const router = Router();

router
    .route("/")
    .post(
        verifyJWT,
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 }
        ]),
        createVideo
    )
    .get(optionalAuth, listVideos);

router
    .route("/:id")
    .get(optionalAuth, getVideoById)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo)
    .delete(verifyJWT, deleteVideo);

router.route("/:id/publish").patch(verifyJWT, togglePublish);

export default router;
