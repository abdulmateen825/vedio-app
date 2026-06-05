import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        isPublic: {
            type: Boolean,
            default: true
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]
    },
    { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
