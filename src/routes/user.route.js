import {Router } from "express";
import {Upload} from "../utils/upload.js";
import { registerUser } from "../controllers/user.controller";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxcount : 1
        },
        {
            name : "coverimages",
            maxcount : 2
        }
    ]),
    registerUser)

export default router;