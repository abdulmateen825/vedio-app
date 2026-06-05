import { asynchandler } from "../utils/asynchandler.js";
import { APIerror } from "../utils/Apierror.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
   try {
      const token =
         req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
         throw new APIerror(401, "Unauthorized");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id).select(
         "-password -refreshToken"
      );

      if (!user) {
         throw new APIerror(401, "Invalid access token");
      }

      req.user = user;
      next();
   } catch (error) {
      throw new APIerror(401, "Invalid access token");
   }
});

export const optionalAuth = asynchandler(async (req, res, next) => {
   const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

   if (!token) {
      return next();
   }

   try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id).select(
         "-password -refreshToken"
      );
      if (user) {
         req.user = user;
      }
      return next();
   } catch (error) {
      return next();
   }
});