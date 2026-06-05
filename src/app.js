import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import videoRoute from "./routes/video.route.js";
import commentRoute from "./routes/comment.route.js";
import likeRoute from "./routes/like.route.js";
import subscriptionRoute from "./routes/subscription.route.js";
import playlistRoute from "./routes/playlist.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRoute);
app.use("/api/v1/videos", videoRoute);
app.use("/api/v1", commentRoute);
app.use("/api/v1/likes", likeRoute);
app.use("/api/v1/subscriptions", subscriptionRoute);
app.use("/api/v1/playlists", playlistRoute);

app.use(errorHandler);

export { app };