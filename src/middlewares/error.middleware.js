import { APIerror } from "../utils/Apierror.js";

export const errorHandler = (err, req, res, next) => {
    const isUploadError =
        err?.name === "MulterError" ||
        err?.message?.includes("Only image files") ||
        err?.message?.includes("Only video files");
    const statusCode = err instanceof APIerror ? err.statusCode : isUploadError ? 400 : 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || []
    });
};
