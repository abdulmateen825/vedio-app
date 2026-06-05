import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    toggleSubscription,
    listSubscribers,
    listSubscriptions
} from "../controllers/subscription.controller.js";

const router = Router();

router.route("/toggle").post(verifyJWT, toggleSubscription);
router.route("/channel/:channelId").get(listSubscribers);
router.route("/me").get(verifyJWT, listSubscriptions);

export default router;
