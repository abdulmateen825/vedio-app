import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { asynchandler } from "../utils/asynchandler.js";
import { APIerror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const buildCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
});

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new APIerror(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new APIerror(500, "Error while generating tokens");
    }
};

const registerUser = asynchandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;

    if ([username, fullname, email, password].some((field) => !field?.trim())) {
        throw new APIerror(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existedUser) {
        throw new APIerror(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new APIerror(400, "Avatar is required");
    }

    const avatarCloud = await uploadToCloudinary(avatarLocalPath);
    const coverCloud = await uploadToCloudinary(coverImageLocalPath);

    if (!avatarCloud?.url) {
        throw new APIerror(400, "Error while uploading avatar");
    }

    const newUser = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatarCloud.url,
        coverImage: coverCloud?.url || ""
    });

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    return res
        .status(201)
        .json(new Apiresponse(201, createdUser, "User registered successfully"));
});

const loginUser = asynchandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
        throw new APIerror(400, "Email or username and password are required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new APIerror(404, "User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new APIerror(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = buildCookieOptions();

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );

    const options = buildCookieOptions();

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new Apiresponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asynchandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingToken) {
        throw new APIerror(401, "Unauthorized access");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(
            incomingToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new APIerror(401, "Invalid refresh token");
    }

    const user = await User.findById(decodedToken._id);
    if (!user || user.refreshToken !== incomingToken) {
        throw new APIerror(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);
    const options = buildCookieOptions();

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed successfully"
            )
        );
});

const changeCurrentPassword = asynchandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new APIerror(400, "Old password and new password are required");
    }

    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new APIerror(401, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new Apiresponse(200, null, "Password changed successfully"));
});

const getCurrentUser = asynchandler(async (req, res) => {
    return res
        .status(200)
        .json(new Apiresponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asynchandler(async (req, res) => {
    const { fullname, username, email } = req.body;

    if (!fullname && !username && !email) {
        throw new APIerror(400, "At least one field is required");
    }

    if (username || email) {
        const existing = await User.findOne({
            _id: { $ne: req.user._id },
            $or: [{ username }, { email }]
        });
        if (existing) {
            throw new APIerror(409, "Username or email already in use");
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                ...(fullname ? { fullname } : {}),
                ...(username ? { username: username.toLowerCase() } : {}),
                ...(email ? { email } : {})
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new Apiresponse(200, updatedUser, "User details updated"));
});

const updateAvatarPicture = asynchandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new APIerror(400, "Avatar is missing");
    }

    const avatarCloud = await uploadToCloudinary(avatarLocalPath);
    if (!avatarCloud?.url) {
        throw new APIerror(400, "Error while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: avatarCloud.url } },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new Apiresponse(200, user, "Avatar updated successfully"));
});

const updateCoverPicture = asynchandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new APIerror(400, "Cover image is missing");
    }

    const coverCloud = await uploadToCloudinary(coverImageLocalPath);
    if (!coverCloud?.url) {
        throw new APIerror(400, "Error while uploading cover image");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { coverImage: coverCloud.url } },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new Apiresponse(200, user, "Cover image updated successfully"));
});

const getUserChannelProfile = asynchandler(async (req, res) => {
    const { username } = req.params;
    if (!username?.trim()) {
        throw new APIerror(400, "Username is missing");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscriptions"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                subscriptionsCount: { $size: "$subscriptions" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                subscriptionsCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1
            }
        }
    ]);

    if (!channel?.length) {
        throw new APIerror(404, "Channel not found");
    }

    return res
        .status(200)
        .json(new Apiresponse(200, channel[0], "Channel found"));
});

const getWatchHistory = asynchandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchedVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    { $unwind: "$owner" },
                    {
                        $project: {
                            title: 1,
                            thumbnailUrl: 1,
                            duration: 1,
                            views: 1,
                            createdAt: 1,
                            owner: {
                                _id: "$owner._id",
                                username: "$owner.username",
                                fullname: "$owner.fullname",
                                avatar: "$owner.avatar"
                            }
                        }
                    }
                ]
             }
         },
         {
             $project: {
                 watchedVideos: 1
             }
         }
     ]);

     return res
         .status(200)
         .json(new Apiresponse(200, user?.[0]?.watchedVideos || [], "Watch history"));
 });

 export {
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
 };
