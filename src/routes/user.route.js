import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, optionalAuth } from "../middlewares/auth.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatarPicture,
    updateCoverPicture,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
    .route("/update-avatar")
    .patch(verifyJWT, upload.single("avatar"), updateAvatarPicture);
router
    .route("/update-cover")
    .patch(verifyJWT, upload.single("coverImage"), updateCoverPicture);

router.route("/c/:username").get(optionalAuth, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;
