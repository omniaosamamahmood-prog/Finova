import jwt from "jsonwebtoken";
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
        };
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}
//# sourceMappingURL=auth.middleware.js.map