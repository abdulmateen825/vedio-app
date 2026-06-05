import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { APIerror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { getPagination } from "../utils/pagination.js";
import { User } from "../models/user.model.js";

const createVideo = asynchandler(async (req, res) => {
    const { title, description, duration, tags, category } = req.body;
    const videoFile = req.files?.videoFile?.[0]?.path;
    const thumbnailFile = req.files?.thumbnail?.[0]?.path;

    if (!title?.trim() || !videoFile || !thumbnailFile || !duration) {
        throw new APIerror(400, "Title, video, thumbnail, and duration are required");
    }

    const videoUpload = await uploadToCloudinary(videoFile, {
        resource_type: "video"
    });
    const thumbnailUpload = await uploadToCloudinary(thumbnailFile);

    if (!videoUpload?.url || !thumbnailUpload?.url) {
        throw new APIerror(400, "Error while uploading media");
    }

    const video = await Video.create({
        owner: req.user._id,
        videoUrl: videoUpload.url,
        thumbnailUrl: thumbnailUpload.url,
        title: title.trim(),
        description: description?.trim() || "",
        duration: Number(duration),
        tags: typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags,
        category: category?.trim()
    });

    return res
        .status(201)
        .json(new Apiresponse(201, video, "Video created successfully"));
});

const listVideos = asynchandler(async (req, res) => {
    const { page, limit, skip, sort } = getPagination(req.query, {
        limit: 12,
        sortBy: "createdAt"
    });

    const match = { isPublished: true };
    if (req.query.owner) {
        match.owner = new mongoose.Types.ObjectId(req.query.owner);
        if (req.user && req.user._id.toString() === req.query.owner) {
            delete match.isPublished;
        }
    }
    if (req.query.category) {
        match.category = req.query.category;
    }
    if (req.query.search) {
        match.$or = [
            { title: { $regex: req.query.search, $options: "i" } },
            { description: { $regex: req.query.search, $options: "i" } }
        ];
    }

    const videos = await Video.find(match)
        .populate("owner", "username fullname avatar")
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Video.countDocuments(match);

    return res.status(200).json(
        new Apiresponse(200, {
            items: videos,
            page,
            limit,
            total
        })
    );
});

const getVideoById = asynchandler(async (req, res) => {
    const video = await Video.findById(req.params.id).populate(
        "owner",
        "username fullname avatar"
    );

    if (!video) {
        throw new APIerror(404, "Video not found");
    }

    const isOwner = req.user && video.owner._id.toString() === req.user._id.toString();
    if (!video.isPublished && !isOwner) {
        throw new APIerror(403, "Video is not published");
    }

    if (req.query.track !== "false") {
        await Video.findByIdAndUpdate(video._id, { $inc: { views: 1 } });
        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { watchHistory: video._id },
                $push: {
                    watchHistory: {
                        $each: [video._id],
                        $position: 0,
                        $slice: 50
                    }
                }
            });
        }
    }

    return res.status(200).json(new Apiresponse(200, video));
});

const updateVideo = asynchandler(async (req, res) => {
    const { title, description, tags, category } = req.body;
    const thumbnailFile = req.file?.path;

    const video = await Video.findById(req.params.id);
    if (!video) {
        throw new APIerror(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new APIerror(403, "Not allowed");
    }

    let thumbnailUrl = video.thumbnailUrl;
    if (thumbnailFile) {
        const thumbnailUpload = await uploadToCloudinary(thumbnailFile);
        if (!thumbnailUpload?.url) {
            throw new APIerror(400, "Error while uploading thumbnail");
        }
        thumbnailUrl = thumbnailUpload.url;
    }

    const normalizedTags =
        typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;

    const updated = await Video.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                ...(title ? { title: title.trim() } : {}),
                ...(description ? { description: description.trim() } : {}),
                ...(category ? { category: category.trim() } : {}),
                ...(normalizedTags ? { tags: normalizedTags } : {}),
                thumbnailUrl
            }
        },
        { new: true }
    );

    return res.status(200).json(new Apiresponse(200, updated, "Video updated"));
});

const deleteVideo = asynchandler(async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) {
        throw new APIerror(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new APIerror(403, "Not allowed");
    }

    await Video.findByIdAndDelete(req.params.id);
    return res.status(200).json(new Apiresponse(200, null, "Video deleted"));
});

const togglePublish = asynchandler(async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) {
        throw new APIerror(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new APIerror(403, "Not allowed");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new Apiresponse(200, video, "Publish status updated")
    );
});

export {
    createVideo,
    listVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublish
};
