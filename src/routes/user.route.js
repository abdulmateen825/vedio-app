import {Router } from "express";
import {Upload} from "../utils/upload.js";
import { loginuser, registerUser ,logoutuser} from "../controllers/user.controller";

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
router.route("/login").post(loginuser)
router.route("/refresh").post(refreshaccesstoken)

//secured routes

router.route("/logout").post(verifyJWT, logoutuser)
export default router;