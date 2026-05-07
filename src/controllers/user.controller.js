import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from  "../utils/apierror.js";
import {User} from "../models/user.model.js";
import {cloudinaryUpload, uploadtocloudinry} from "../utils/cloudinary.js";
import {Apiresponse} from "../utils/apiresponse.js";


const registerUser = asynchandler( async (req, res) => {
   //get user credentials from front end
   const {username , fullname , email , passowrd } = req.body
   //validation
   if( 
    [username , fullname , email , passowrd].some((field) => field?.trim() === "")
   ){
      throw new ApiError("All fields are required" , 400)
   }
   //check if user already exists
   const user = await User.findOne({
      $or: [{ email }, { username }]
   })
   if(user){
        throw new ApiError("User already exists" , 400)
   }

   //check images and avatar
   const avatarlocalpath = req.files?.avatar[0]?.path;
   const coverimagelocalpath = req.files?.coverimage[0]?.path;
   if(!avatarlocalpath){
        throw new ApiError("Avatar is required" , 400)
   }
    const avatarcloudinaryurl = await uploadtocloudinry(avatarlocalpath);
    const coverimagecloudinaryurl = await uploadtocloudinry(coverimagelocalpath);
    //create new user in the database
    const newuser = await User.create({
        username :username.toLowerCase() , 
        fullname ,
        email , 
        password ,
        avatar : avatarcloudinaryurl.url,
        coverimage : coverimagecloudinaryurl?.url || "",

    })
    const checkuser = await User.findById(user._id).select(
        "-password -refreshtoken" 
    )

    if(!checkuser){
        throw new ApiError("User not found" , 500)
    }

    return res.status(201).json(
        new Apiresponse(
            200,
            checkuser,
            "user registered successfully"
        )
    )


})


export {registerUser}



