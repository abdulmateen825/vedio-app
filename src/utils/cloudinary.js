import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const hasCloudinaryConfig = () =>
    [process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET]
        .every((value) => value && !value.startsWith("your_"));

const buildLocalFileUrl = (filePath) => {
    const publicRoot = path.resolve("public");
    const absolutePath = path.resolve(filePath);
    const relativePath = path.relative(publicRoot, absolutePath).replace(/\\/g, "/");
    const port = process.env.PORT || 8000;
    const baseUrl = process.env.SERVER_PUBLIC_URL || `http://localhost:${port}`;

    if (relativePath.startsWith("..")) {
        return null;
    }

    return `${baseUrl}/${relativePath}`;
};

const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        if (!filePath) return null;
        if (!hasCloudinaryConfig()) {
            if (process.env.NODE_ENV !== "production") {
                const localUrl = buildLocalFileUrl(filePath);
                if (localUrl) {
                    return { url: localUrl, secure_url: localUrl, provider: "local" };
                }
            }

            const error = new Error("Cloudinary environment variables are missing or still set to placeholders");
            error.code = "CLOUDINARY_CONFIG_MISSING";
            throw error;
        }
        const uploadResponse = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            ...options
        });
        fs.unlinkSync(filePath);
        return uploadResponse;
    } catch (error) {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return {
            error: error.message,
            code: error.code
        };
    }
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export { uploadToCloudinary };
