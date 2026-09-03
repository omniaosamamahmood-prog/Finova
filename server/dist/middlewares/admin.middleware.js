import prisma from "../config/prisma.js";
import { isAdminEmail } from "../utils/admin.js";
export async function requireAdmin(req, res, next) {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user || !isAdminEmail(user.email)) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }
        next();
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}
//# sourceMappingURL=admin.middleware.js.map