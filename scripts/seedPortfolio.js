import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { User } from "../src/models/user.model.js";
import { Video } from "../src/models/video.model.js";
import { DB_NAME } from "../src/constant.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 8000;
const baseUrl = process.env.SERVER_PUBLIC_URL || `http://localhost:${port}`;
const assetsDir = path.resolve("public", "seed-assets");
const brandName = "CineNest";
const studioUsername = "cinenest-studio";
const fallbackVideoPath = path.resolve(assetsDir, "cinenest-demo.mp4");

const videos = [
    {
        title: "Designing a Creator Dashboard from Scratch",
        description:
            "A crisp product-design walkthrough covering layout, analytics cards, and creator-first dashboard decisions.",
        category: "Design",
        duration: 754,
        views: 48200,
        palette: ["#1f1a17", "#c2410c", "#fed7aa"],
        tags: ["design", "dashboard", "creator"]
    },
    {
        title: "Building a Full Stack Video Upload Flow",
        description:
            "A practical engineering session on auth, media upload, progress states, and resilient API feedback.",
        category: "Technology",
        duration: 988,
        views: 76100,
        palette: ["#18181b", "#7c2d12", "#fbbf24"],
        tags: ["mern", "upload", "api"]
    },
    {
        title: "How to Compose Better Thumbnails",
        description:
            "Thumbnail composition principles for stronger contrast, scanability, and creator brand consistency.",
        category: "Art",
        duration: 612,
        views: 29500,
        palette: ["#292524", "#ea580c", "#fde68a"],
        tags: ["thumbnail", "visuals", "branding"]
    },
    {
        title: "Productivity Systems for Solo Creators",
        description:
            "A focused workflow for planning, recording, publishing, and reviewing video content without chaos.",
        category: "Productivity",
        duration: 841,
        views: 53800,
        palette: ["#1c1917", "#be123c", "#fecdd3"],
        tags: ["workflow", "creator", "planning"]
    },
    {
        title: "Modern JavaScript Patterns in Real Apps",
        description:
            "A clean tour through state, async data, API boundaries, and component patterns in production React apps.",
        category: "Technology",
        duration: 1044,
        views: 91300,
        palette: ["#1e1b4b", "#c2410c", "#f5d0fe"],
        tags: ["javascript", "react", "frontend"]
    },
    {
        title: "Studio Lighting for Desk Setups",
        description:
            "Simple lighting decisions that make small recording spaces look sharper, warmer, and more intentional.",
        category: "Education",
        duration: 696,
        views: 41800,
        palette: ["#0c0a09", "#d97706", "#fef3c7"],
        tags: ["studio", "lighting", "setup"]
    },
    {
        title: "Editing Rhythm: Make Tutorials Feel Faster",
        description:
            "A practical editing guide for pacing, pauses, transitions, and keeping educational videos moving.",
        category: "Education",
        duration: 903,
        views: 67200,
        palette: ["#111827", "#f97316", "#bae6fd"],
        tags: ["editing", "tutorials", "pacing"]
    },
    {
        title: "Launching a Portfolio Project with Polish",
        description:
            "A complete pass on presentation details: seed data, UI states, navigation, and screenshot-ready surfaces.",
        category: "Startups",
        duration: 817,
        views: 58700,
        palette: ["#211f1b", "#9a3412", "#e7e5e4"],
        tags: ["portfolio", "launch", "product"]
    }
];

const ensureDemoVideo = () => {
    fs.mkdirSync(assetsDir, { recursive: true });

    if (fs.existsSync(fallbackVideoPath)) return;

    if (!fs.existsSync(path.resolve("public", "temp"))) return;

    const uploadedVideo = fs
        .readdirSync(path.resolve("public", "temp"), { withFileTypes: true })
        .find((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".mp4"));

    if (uploadedVideo) {
        fs.copyFileSync(
            path.resolve("public", "temp", uploadedVideo.name),
            fallbackVideoPath
        );
    }
};

const writeThumbnail = (video, index) => {
    const fileName = `cinenest-thumb-${index + 1}.svg`;
    const [dark, accent, light] = video.palette;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="${dark}"/>
  <circle cx="1060" cy="120" r="220" fill="${accent}" opacity="0.32"/>
  <circle cx="160" cy="640" r="260" fill="${light}" opacity="0.18"/>
  <rect x="80" y="82" width="1160" height="556" rx="42" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
  <text x="112" y="152" fill="${light}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="5">CINENEST ORIGINAL</text>
  <text x="112" y="332" fill="#fff7ed" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="800">${video.title}</text>
  <rect x="112" y="454" width="150" height="150" rx="75" fill="${accent}"/>
  <polygon points="172,498 172,564 228,531" fill="#fff7ed"/>
  <text x="292" y="518" fill="#fed7aa" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">${video.category}</text>
  <text x="292" y="570" fill="#ffffff" opacity="0.78" font-family="Arial, Helvetica, sans-serif" font-size="26">${video.views.toLocaleString()} views</text>
</svg>`;

    fs.writeFileSync(path.resolve(assetsDir, fileName), svg);
    return `${baseUrl}/seed-assets/${fileName}`;
};

const seed = async () => {
    ensureDemoVideo();

    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    let creator = await User.findOne({ username: studioUsername });
    if (!creator) {
        creator = await User.create({
            username: studioUsername,
            fullname: `${brandName} Studio`,
            email: "studio@cinenest.local",
            password: "portfolio123",
            avatar: `${baseUrl}/seed-assets/cinenest-avatar.svg`,
            coverImage: `${baseUrl}/seed-assets/cinenest-cover.svg`
        });
    } else {
        creator.fullname = `${brandName} Studio`;
        creator.avatar = `${baseUrl}/seed-assets/cinenest-avatar.svg`;
        creator.coverImage = `${baseUrl}/seed-assets/cinenest-cover.svg`;
        await creator.save({ validateBeforeSave: false });
    }

    fs.writeFileSync(
        path.resolve(assetsDir, "cinenest-avatar.svg"),
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" rx="96" fill="#c2410c"/><circle cx="200" cy="200" r="116" fill="#fff7ed" opacity=".18"/><polygon points="174,134 174,266 284,200" fill="#fff7ed"/></svg>`
    );
    fs.writeFileSync(
        path.resolve(assetsDir, "cinenest-cover.svg"),
        `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="420"><rect width="1400" height="420" fill="#1f1a17"/><circle cx="1120" cy="40" r="300" fill="#c2410c" opacity=".35"/><circle cx="170" cy="380" r="240" fill="#fed7aa" opacity=".18"/><text x="80" y="230" fill="#fff7ed" font-family="Arial" font-size="72" font-weight="800">${brandName} Studio</text></svg>`
    );

    const videoUrl = fs.existsSync(fallbackVideoPath)
        ? `${baseUrl}/seed-assets/reelora-demo.mp4`
        : `${baseUrl}/temp/videoFile-1780857170323-879334239.mp4`;

    for (const [index, item] of videos.entries()) {
        await Video.findOneAndUpdate(
            { owner: creator._id, title: item.title },
            {
                $set: {
                    owner: creator._id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    tags: item.tags,
                    duration: item.duration,
                    views: item.views,
                    isPublished: true,
                    videoUrl,
                    thumbnailUrl: writeThumbnail(item, index)
                }
            },
            { upsert: true, returnDocument: "after" }
        );
    }

    await mongoose.disconnect();
    console.log(`Seeded ${videos.length} ${brandName} portfolio videos into ${DB_NAME}.`);
};

seed().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
});
