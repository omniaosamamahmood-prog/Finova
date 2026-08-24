import { ZodError } from "zod";
import { loginUser, registerUser } from "../services/auth.service.js";
import { authenticateWithGoogle, GoogleAuthError, } from "../services/googleAuth.service.js";
import { AuthEmailError, changePasswordForUser, forgotPassword, resendVerificationEmail, resetPassword, resolveApiBaseUrl, verifyEmailToken, } from "../services/authEmail.service.js";
import { changePasswordSchema, emailOnlySchema, loginSchema, registerSchema, resetPasswordSchema, } from "../validations/auth.validation.js";
import { googleAuthSchema } from "../validations/googleAuth.validation.js";
import { getAppUrl } from "../utils/secureToken.js";
function zodError(res, error) {
    return res.status(400).json({
        success: false,
        errors: error.issues.map((issue) => issue.message),
    });
}
function friendlyError(res, error) {
    if (error instanceof ZodError) {
        return zodError(res, error);
    }
    if (error instanceof GoogleAuthError || error instanceof AuthEmailError) {
        return res.status(400).json({
            success: false,
            message: error.message,
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
export async function register(req, res) {
    try {
        const data = registerSchema.parse(req.body);
        const apiBaseUrl = resolveApiBaseUrl(req);
        const user = await registerUser(data, apiBaseUrl);
        return res.status(201).json({
            success: true,
            data: user,
            message: user.emailSent
                ? "Account created. Please verify your email."
                : "Account created, but the verification email could not be sent.",
            emailSent: user.emailSent,
        });
    }
    catch (error) {
        return friendlyError(res, error);
    }
}
export async function login(req, res) {
    try {
        const data = loginSchema.parse(req.body);
        const result = await loginUser(data);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        return friendlyError(res, error);
    }
}
export async function googleAuth(req, res) {
    try {
        const { credential } = googleAuthSchema.parse(req.body);
        const data = await authenticateWithGoogle(credential);
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        return friendlyError(res, error);
    }
}
export async function verifyEmail(req, res) {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    const status = await verifyEmailToken(token);
    const redirectStatus = status === "success" ? "success" : status === "expired" ? "expired" : "failed";
    const wantsJson = req.query.format === "json" ||
        req.get("accept")?.includes("application/json");
    if (wantsJson) {
        if (status === "success") {
            return res.status(200).json({
                success: true,
                status: "success",
                message: "Email verified successfully",
            });
        }
        return res.status(400).json({
            success: false,
            status: redirectStatus,
            message: status === "expired"
                ? "Verification link has expired"
                : "Invalid verification link",
        });
    }
    try {
        const appUrl = getAppUrl();
        return res.redirect(`${appUrl}/verify-email?status=${encodeURIComponent(redirectStatus)}`);
    }
    catch {
        return res.status(500).send("APP_URL is not configured");
    }
}
export async function resendVerification(req, res) {
    try {
        const { email } = emailOnlySchema.parse(req.body);
        const apiBaseUrl = resolveApiBaseUrl(req);
        const result = await resendVerificationEmail(email, apiBaseUrl);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        return friendlyError(res, error);
    }
}
export async function forgotPasswordHandler(req, res) {
    try {
        const { email } = emailOnlySchema.parse(req.body);
        const result = await forgotPassword(email);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        return friendlyError(res, error);
    }
}
export async function resetPasswordHandler(req, res) {
    try {
        const data = resetPasswordSchema.parse(req.body);
        const result = await resetPassword({
            token: data.token,
            password: data.password,
        });
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        return friendlyError(res, error);
    }
}
export async function changePasswordHandler(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const data = changePasswordSchema.parse(req.body);
        const result = await changePasswordForUser({
            userId,
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        return friendlyError(res, error);
    }
}
//# sourceMappingURL=auth.controller.js.map