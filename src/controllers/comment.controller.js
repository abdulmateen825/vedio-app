import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { APIerror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { getPagination } from "../utils/pagination.js";

const listComments = asynchandler(async (req, res) => {
    const { page, limit, skip, sort } = getPagination(req.query, {
        limit: 20,
        sortBy: "createdAt"
    });

    const comments = await Comment.find({ video: req.params.videoId })
        .populate("owner", "username fullname avatar")
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Comment.countDocuments({ video: req.params.videoId });

    return res.status(200).json(
        new Apiresponse(200, {
            items: comments,
            page,
            limit,
            total
        })
    );
});

const addComment = asynchandler(async (req, res) => {
    const { content } = req.body;
    if (!content?.trim()) {
        throw new APIerror(400, "Comment content is required");
    }

    const video = await Video.findById(req.params.videoId);
    const isOwner = video?.owner?.toString() === req.user._id.toString();
    if (!video || (!video.isPublished && !isOwner)) {
        throw new APIerror(404, "Video not found");
    }

    const comment = await Comment.create({
        video: req.params.videoId,
        owner: req.user._id,
        content: content.trim()
    });

    return res
        .status(201)
        .json(new Apiresponse(201, comment, "Comment added"));
});

const updateComment = asynchandler(async (req, res) => {
    const { content } = req.body;
    if (!content?.trim()) {
        throw new APIerror(400, "Comment content is required");
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        throw new APIerror(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new APIerror(403, "Not allowed");
    }

    comment.content = content.trim();
    await comment.save();

    return res
        .status(200)
        .json(new Apiresponse(200, comment, "Comment updated"));
});

const deleteComment = asynchandler(async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        throw new APIerror(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new APIerror(403, "Not allowed");
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json(new Apiresponse(200, null, "Comment deleted"));
});

export { listComments, addComment, updateComment, deleteComment };
