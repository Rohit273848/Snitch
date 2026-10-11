import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const err = new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
            err.code = "INVALID_FILE_TYPE";
            cb(err);
        }
    }
});

export default upload;