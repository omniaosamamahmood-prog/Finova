import { ZodError } from "zod";
import prisma from "../config/prisma.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { deleteAvatarFile, toAvatarUrl } from "../utils/avatarStorage.js";
import { changePasswordSchema, updateProfileSchema, } from "../validations/profile.validation.js";
import { isAdminEmail } from "../utils/admin.js";
const profileSelect = {
    id: true,
    fullName: true,
    email: true,
    avatarUrl: true,
    plan: true,
    createdAt: true,
};
function withAdminFlag(user) {
    return {
        ...user,
        isAdmin: isAdminEmail(user.email),
    };
}
function unauthorized(res) {
    return res.status(401).json({
        success: false,
        message: "Unauthorized",
    });
}
function handleError(res, error) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            errors: error.issues.map((issue) => issue.message),
        });
    }
    if (error instanceof Error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
export async function getProfile(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: profileSelect,
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: withAdminFlag(user),
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function updateProfile(req, res) {
    const newFileName = req.file?.filename;
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const existing = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatarUrl: true },
        });
        if (!existing) {
            deleteAvatarFile(newFileName ? toAvatarUrl(newFileName) : null);
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const hasFullName = typeof req.body.fullName === "string";
        const removeAvatar = req.body.removeAvatar === "true" || req.body.removeAvatar === true;
        if (!hasFullName && !newFileName && !removeAvatar) {
            return res.status(400).json({
                success: false,
                message: "No changes provided",
            });
        }
        const data = {};
        if (hasFullName) {
            const parsed = updateProfileSchema.parse({
                fullName: req.body.fullName,
            });
            data.fullName = parsed.fullName;
        }
        if (newFileName) {
            data.avatarUrl = toAvatarUrl(newFileName);
        }
        else if (removeAvatar) {
            data.avatarUrl = null;
        }
        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: profileSelect,
        });
        if ((newFileName || removeAvatar) && existing.avatarUrl) {
            deleteAvatarFile(existing.avatarUrl);
        }
        return res.status(200).json({
            success: true,
            data: withAdminFlag(user),
        });
    }
    catch (error) {
        deleteAvatarFile(newFileName ? toAvatarUrl(newFileName) : null);
        return handleError(res, error);
    }
}
export async function changePassword(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return unauthorized(res);
        }
        const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "Password login is not set for this account",
            });
        }
        const isCurrentValid = await comparePassword(currentPassword, user.password);
        if (!isCurrentValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }
        const hashedPassword = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
//# sourceMappingURL=profile.controller.js.map