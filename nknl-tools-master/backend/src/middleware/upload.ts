import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimeTypes = ["video/mp4", "video/quicktime", "video/webm", "video/avi", "video/x-matroska"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Format file tidak didukung. Gunakan MP4, MOV, WebM, atau AVI."));
    }
};

const mediaFileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimeTypes = [
        // Video
        "video/mp4", "video/quicktime", "video/webm", "video/avi", "video/x-matroska",
        // Image
        "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Format tidak didukung. Gunakan MP4, MOV, WebM, JPG, PNG, atau WebP."));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
});

export const uploadMedia = multer({
    storage,
    fileFilter: mediaFileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
});
