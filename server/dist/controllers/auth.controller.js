import { loginUser, registerUser } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { ZodError } from "zod";
export async function register(req, res) {
    try {
        const data = registerSchema.parse(req.body);
        const user = await registerUser(data);
        return res.status(201).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
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
}
export async function login(req, res) {
    try {
        const data = loginSchema.parse(req.body);
        const user = await loginUser(data);
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
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
}
//# sourceMappingURL=auth.controller.js.map