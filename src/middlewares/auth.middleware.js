import { asynchandler} from "../utils/asynchandler.js"
import { APIerror } from "../utils/Apierror.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


export const verifyJWT = asynchandler( async (req, res, next) =>{
             try {
                const token = req.cookies?.accesstoken ||
             req.header("Authorization")?.
             replace("Bearer ", "")
                if(!token){
                    throw new APIerror(401 , "Unauthorized")
                }
              const decodedtoken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

                await User.findById(decodedtoken._id).select("-password -refreshtoken")
                if(!user){
                    throw new APIerror(401 , "invalid access token")
                }
                req.user = user
                next()
             } catch (error){
                throw new APIerror(401 , "invalid access token")
             }


})