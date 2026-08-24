import multer from "multer";
import { AVATAR_MIME_TO_EXT, AVATARS_DIR, MAX_AVATAR_BYTES, ensureAvatarsDir, } from "../utils/avatarStorage.js";
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        ensureAvatarsDir();
        cb(null, AVATARS_DIR);
    },
    filename: (req, file, cb) => {
        const userId = req.user?.id ?? "anon";
        const ext = AVATAR_MIME_TO_EXT[file.mimetype] ?? ".jpg";
        cb(null, `${userId}-${Date.now()}${ext}`);
    },
});
const upload = multer({
    storage,
    limits: {
        fileSize: MAX_AVATAR_BYTES,
    },
    fileFilter: (_req, file, cb) => {
        if (AVATAR_MIME_TO_EXT[file.mimetype]) {
            cb(null, true);
            return;
        }
        cb(new Error("Only image files are allowed"));
    },
});
export function uploadAvatar(req, res, next) {
    upload.single("avatar")(req, res, (error) => {
        if (!error) {
            next();
            return;
        }
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "Avatar must be 2MB or smaller",
                });
            }
            return res.status(400).json({
                success: false,
                message: "Could not upload avatar",
            });
        }
        const message = error instanceof Error ? error.message : "Could not upload avatar";
        return res.status(400).json({
            success: false,
            message,
        });
    });
}
//# sourceMappingURL=upload.middleware.js.map