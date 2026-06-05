import { Router } from "express";
import { verifyJWT, optionalAuth } from "../middlewares/auth.middleware.js";
import {
    createPlaylist,
    getPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    listMyPlaylists,
    listUserPlaylists
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createPlaylist);
router.route("/me").get(verifyJWT, listMyPlaylists);
router.route("/user/:userId").get(listUserPlaylists);

router
    .route("/:id")
    .get(optionalAuth, getPlaylist)
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist);
router.route("/:id/add").post(verifyJWT, addVideoToPlaylist);
router.route("/:id/remove").post(verifyJWT, removeVideoFromPlaylist);

export default router;
