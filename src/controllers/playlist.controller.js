import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { APIerror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { getPagination } from "../utils/pagination.js";

const createPlaylist = asynchandler(async (req, res) => {
    const { title, description, isPublic } = req.body;
    if (!title?.trim()) {
        throw new APIerror(400, "Title is required");
    }

    const playlist = await Playlist.create({
        owner: req.user._id,
        title: title.trim(),
        description: description?.trim() || "",
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true
    });

    return res
        .status(201)
        .json(new Apiresponse(201, playlist, "Playlist created"));
});

const getPlaylist = asynchandler(async (req, res) => {
    const playlist = await Playlist.findById(req.params.id).populate(
        "videos",
        "title thumbnailUrl duration views"
    );

    if (!playlist) {
        throw new APIerror(404, "Playlist not found");
    }

    if (!playlist.isPublic) {
        if (!req.user || playlist.owner.toString() !== req.user._id.toString()) {
            throw new APIerror(403, "Not allowed");
        }
    }

    return res.status(200).json(new Apiresponse(200, playlist));
});

const updatePlaylist = asynchandler(async (req, res) => {
    const { title, description, isPublic } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
        throw new APIerror(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new APIerror(403, "Not allowed");
    }

    playlist.title = title?.trim() || playlist.title;
    playlist.description = description?.trim() ?? playlist.description;
    if (isPublic !== undefined) {
        playlist.isPublic = Boolean(isPublic);
    }

    await playlist.save();
    return res
        .status(200)
        .json(new Apiresponse(200, playlist, "Playlist updated"));
});

const deletePlaylist = asynchandler(async (req, res) => {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
        throw new APIerror(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new APIerror(403, "Not allowed");
    }

    await Playlist.findByIdAndDelete(req.params.id);
    return res.status(200).json(new Apiresponse(200, null, "Playlist deleted"));
});

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const { videoId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new APIerror(400, "Invalid video id");
    }

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
        throw new APIerror(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new APIerror(403, "Not allowed");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new APIerror(404, "Video not found");
    }

    if (!playlist.videos.includes(videoId)) {
        playlist.videos.push(videoId);
        await playlist.save();
    }

    return res
        .status(200)
        .json(new Apiresponse(200, playlist, "Video added to playlist"));
});

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const { videoId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new APIerror(400, "Invalid video id");
    }

    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
        throw new APIerror(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new APIerror(403, "Not allowed");
    }

    playlist.videos = playlist.videos.filter(
        (id) => id.toString() !== videoId.toString()
    );
    await playlist.save();

    return res
        .status(200)
        .json(new Apiresponse(200, playlist, "Video removed from playlist"));
});

const listMyPlaylists = asynchandler(async (req, res) => {
    const { page, limit, skip, sort } = getPagination(req.query, {
        limit: 12,
        sortBy: "createdAt"
    });

    const playlists = await Playlist.find({ owner: req.user._id })
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Playlist.countDocuments({ owner: req.user._id });

    return res.status(200).json(
        new Apiresponse(200, {
            items: playlists,
            page,
            limit,
            total
        })
    );
});

const listUserPlaylists = asynchandler(async (req, res) => {
    const { page, limit, skip, sort } = getPagination(req.query, {
        limit: 12,
        sortBy: "createdAt"
    });

    const playlists = await Playlist.find({
        owner: req.params.userId,
        isPublic: true
    })
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Playlist.countDocuments({
        owner: req.params.userId,
        isPublic: true
    });

    return res.status(200).json(
        new Apiresponse(200, {
            items: playlists,
            page,
            limit,
            total
        })
    );
});

export {
    createPlaylist,
    getPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    listMyPlaylists,
    listUserPlaylists
};
