import { getAdminOverview, listAdminFeedback, listAdminUsers, } from "../services/admin.service.js";
import { setUserPlan } from "../services/plan.service.js";
import { z, ZodError } from "zod";
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
export async function getOverview(_req, res) {
    try {
        const data = await getAdminOverview();
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function getUsers(_req, res) {
    try {
        const data = await listAdminUsers();
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
export async function getFeedback(_req, res) {
    try {
        const data = await listAdminFeedback();
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
const updateUserPlanSchema = z.object({
    plan: z.enum(["FREE", "PREMIUM"]),
});
export async function updateUserPlan(req, res) {
    try {
        const rawId = req.params.id;
        const userId = Array.isArray(rawId) ? rawId[0] : rawId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }
        const { plan } = updateUserPlanSchema.parse(req.body);
        const data = await setUserPlan(userId, plan);
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
}
//# sourceMappingURL=admin.controller.js.map