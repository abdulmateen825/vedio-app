import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        if (!filePath) return null;
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
        return null;
    }
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export { uploadToCloudinary };