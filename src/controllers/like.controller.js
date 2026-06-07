import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { APIerror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { getPagination } from "../utils/pagination.js";

const toggleLike = asynchandler(async (req, res) => {
    const { targetType, targetId } = req.body;
    if (!targetType || !targetId) {
        throw new APIerror(400, "Target type and id are required");
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
        throw new APIerror(400, "Invalid target id");
    }

    if (targetType === "Video") {
        const video = await Video.findById(targetId);
        const isOwner = video?.owner?.toString() === req.user._id.toString();
        if (!video || (!video.isPublished && !isOwner)) {
            throw new APIerror(404, "Video not found");
        }
    }

    if (targetType === "Comment") {
        const comment = await Comment.findById(targetId);
        if (!comment) {
            throw new APIerror(404, "Comment not found");
        }
    }

    const existing = await Like.findOne({
        user: req.user._id,
        targetType,
        targetId
    });

    if (existing) {
        await Like.findByIdAndDelete(existing._id);
        return res.status(200).json(new Apiresponse(200, { liked: false }));
    }

    await Like.create({
        user: req.user._id,
        targetType,
        targetId
    });

    return res.status(200).json(new Apiresponse(200, { liked: true }));
});

const getLikesCount = asynchandler(async (req, res) => {
    const { targetType, targetId } = req.query;
    if (!targetType || !targetId) {
        throw new APIerror(400, "Target type and id are required");
    }

    const count = await Like.countDocuments({ targetType, targetId });
    return res.status(200).json(new Apiresponse(200, { count }));
});

const listLikedVideos = asynchandler(async (req, res) => {
    const { page, limit, skip, sort } = getPagination(req.query, {
        limit: 12,
        sortBy: "createdAt"
    });

    const likes = await Like.find({ user: req.user._id, targetType: "Video" })
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const videoIds = likes.map((like) => like.targetId);
    const videos = await Video.find({ _id: { $in: videoIds } })
        .populate("owner", "username fullname avatar")
        .sort(sort);

    const total = await Like.countDocuments({
        user: req.user._id,
        targetType: "Video"
    });

    return res.status(200).json(
        new Apiresponse(200, {
            items: videos,
            page,
            limit,
            total
        })
    );
});

export { toggleLike, getLikesCount, listLikedVideos };
