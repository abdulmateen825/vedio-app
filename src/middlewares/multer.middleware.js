import multer from "multer";
import fs from "fs";
import path from "path";

const tempDir = path.resolve("public", "temp");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdirSync(tempDir, { recursive: true });
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = path.extname(file.originalname || "");
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "avatar" || file.fieldname === "coverImage" || file.fieldname === "thumbnail") {
        if (!file.mimetype?.startsWith("image/")) {
            return cb(new Error("Only image files are allowed for this field"));
        }
    }

    if (file.fieldname === "videoFile" && !file.mimetype?.startsWith("video/")) {
        return cb(new Error("Only video files are allowed for video upload"));
    }

    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 1024
    }
});
