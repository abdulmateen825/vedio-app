import { asynchandler } from "../utils/asynchandler.js";
import { APIerror } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import { uploadtocloudinry } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import {generateAccessToken , generateRefreshToken} from "../models/user.model.js"
import jwt from "jsonwebtoken"

const generatetokens = async(userId) =>{
    try {
        //generate access and refresh token
        const user =await User.findById(userId)
        const accesstoken = await user.generateAccessToken()
        const refreshtoken = await user.generateRefreshToken()
        
        user.refreshtoken = refreshtoken
        await user.save({validateBeforeSave : false})

        return {accesstoken , refreshtoken}

    } catch (error) {
        throw new APIerror(500 , "Error while generating tokens")
        
    }
}


const registerUser = asynchandler(async (req, res) => {
    //get user credentials from front end
    const { username, fullname, email, password } = req.body
    //validation
    if (
        [username, fullname, email, password].some((field) => field?.trim() === "")
    ) {
        throw new APIerror(400, "All fields are required")
    }
    //check if user already exists
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new APIerror(409, "User already exists")
    }

    //check images and avatar
    const avatarlocalpath = req.files?.avatar[0]?.path;

    let coverimagelocalpath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverimagelocalpath = req.files.coverimage[0].path
    }

    if (!avatarlocalpath) {
        throw new APIerror(400, "Avatar is required")
    }
    const avatarcloudinaryurl = await uploadtocloudinry(avatarlocalpath);
    const coverimagecloudinaryurl = await uploadtocloudinry(coverimagelocalpath);

    if (!avatarcloudinaryurl) {
        throw new APIerror(400, "Error while uploading avatar")
    }

    //create new user in the database
    const newuser = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatarcloudinaryurl.url,
        coverimage: coverimagecloudinaryurl?.url || "",

    })
    const checkuser = await User.findById(newuser._id).select(
        "-password -refreshtoken"
    )

    if (!checkuser) {
        throw new APIerror(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new Apiresponse(
            201,
            "user registered successfully",
            checkuser
        )
    )


})
const loginuser = asynchandler( async (req, res) => {
      //get data from request body
      const { email , username ,password } = req.body
      if( !username || !email){
        throw new APIerror(400 , "email and username are required")
      }
      //find user 
      const user = await User.findOne({
        $or : [
            {email},
            {username}
        ]
      })
      if(!user){
        throw new APIerror(404 , "user does not exist")
      }

      //check password
      const ispasswordcorrect = await user.ispasswordcorrect(password)
        if(!ispasswordcorrect){
            throw new APIerror(401 , "invalid credentials")
        }
        //generate access and refresh tokens
        const { accesstoken, refreshtoken } = await generateTokens(user._id)
        const loggedinuser = await User.findById(user._id).select
        ("-password -refreshtoken")

        const options = {
            httpOnly : true,
            secure : true 
        }

        return res
        .status(200)
        .cookie("accesstoken" , accesstoken , options)
        .cookie("refreshtoken" , refreshtoken , options)
        .json(
            new Apiresponse(
                200,
                {
                user : 
                loggedinuser,accesstoken,refreshtoken
                },
                "user logged in successfully"
        )
    )
})


const logoutuser = asynchandler( async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id , {
           $set : {
            refreshtoken : undefined
           }
        },
        {
            new : true
        })
    const options = {
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .clearCookie("accesstoken" , options)
    .clearCookie("refreshtoken" , options)
    .json(
        new Apiresponse(
            200,
            "user logged out successfully"
        )
        )
})

const refreshaccesstoken = asynchandler( async (req, res )=>{
    const incomingtoken = req.cookies?.refreshtoken
    || req.body.refreshtoken
    if (!incomingtoken){
        throw new APIerror(401 , "unauthorized access")

    }
    const decodedtoken = jwt.verify(incomingtoken , process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedtoken._id)
     if (!user){
        throw new APIerror(401 , "invalid refresh token")
    
    }
    if (user?.refreshtoken !== incomingtoken){
        throw new APIerror(401 , "refresh token is expired or used")
    }

    const options = {
        httpOnly : true,
        secure : true
    }
    const { accesstoken , refreshtoken } = await generatetokens(user._id)
    return res
    .status(200)
    .cookie("accesstoken" , accesstoken , options)
    .cookie("refreshtoken" , refreshtoken , options)
    .json(
        new Apiresponse(
            200,
            {accesstoken , refreshtoken : refreshtoken},
            "access token refreshed successfully"
        )
    )
})

const changecurrentpassword = asynchandler( async (req, res) => {
    const {oldpassword , newpassword} = req.body
    const user = await User.findById(req.user._id)
    user.ispasswordcorrect(oldpassword)
    if(!ispasswordcorrect){
        throw new APIerror(401 , "invalid old password")
    }
    user.password = newpassword
    await user.save({validateBeforeSave : false})

    return res.status(200).json(
        new Apiresponse(
            200,
            "password changed successfully"
        )
    )

})

const getcurrentuser = asynchandler( async (req, res) => {
    return res.status(200).json(
        new Apiresponse(
            200,
            req.user,
            "current user fetched successfully"
        )
    )
})

const updateAccountdetails  = asynchandler ( async (req , res)=>{
    const {fullname , username , email} = req.body
    if (!fullname || !username || !email){
        throw new APIerror(400 , "fullname , username and email are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
    {
        $set :{
        fullname: fullname,
        username: username,
        email: email
        }
    }, { new: true })
    .select("-password")

    return res.status(200)
    .json(
        new Apiresponse(
            200,
            user,
            "user details have been updated"
        )
    )
})

const updateavatarpicture = asynchandler(async (req , res) => {
        const avatarlocalpath = req.file?.path
        if(!avatarlocalpath){
            throw new APIerror (400 , "avatar is missing")
        }
        const avatarcloudinaryurl = await uploadtocloudinry(avatarlocalpath)
        if(!avatarcloudinaryurl){
            throw new APIerror(400 , "error while uploading avatar")
        }
        const user = await User.findByIdAndUpdate(req.user._id,
            {
                $set : {
                    avatar : avatarcloudinaryurl
                }
            },
            {
                new : true
            }
        ).select("-password")
        return res.status(200).json(
            new Apiresponse(
                200,
                user,
                "avatar updated successfully"
            )
        )
})
const updatecoverpicture = asynchandler(async (req , res) => {
        const coverimagelocalpath = req.file?.path
        if(!coverimagelocalpath){
            throw new APIerror (400 , "cover image is missing")
        }
        const coverimagecloudinaryurl = await uploadtocloudinry(coverimagelocalpath)
        if(!coverimagecloudinaryurl){
            throw new APIerror(400 , "error while uploading cover image")
        }
        const user = await User.findByIdAndUpdate(req.user._id,
            {
                $set : {
                    coverimage : coverimagecloudinaryurl
                }
            },
            {
                new : true
            }
        ).select("-password")
        return res.status(200).json(
            new Apiresponse(
                200,
                user,
                "cover image updated successfully"
            )
        )
})

export { registerUser, 
     loginuser , 
     logoutuser ,
     refreshaccesstoken , 
     changecurrentpassword, 
     getcurrentuser , 
     updateAccountdetails , 
     updateavatarpicture , 
     updatecoverpicture}

