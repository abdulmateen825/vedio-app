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
router.route("/changepassword").post(verifyJWT , changecurrentpassword)
router.route("/updateAccountDetails").post(verifyJWT , updateaccountdetails)
router.route("/updateAvatar").post(verifyJWT , updateavatarpicture)
router.route("/updateCoverImage").post(verifyJWT , updatecoverpicture)
//secured routes

router.route("/logout").post(verifyJWT, logoutuser)
export default router;