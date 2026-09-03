import prisma from "../config/prisma.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";
import { createDefaultCategoriesForUser } from "./category.service.js";
import { issueEmailVerification } from "./authEmail.service.js";
const userSelect = {
    id: true,
    fullName: true,
    email: true,
    avatarUrl: true,
    emailVerified: true,
    plan: true,
    createdAt: true,
    updatedAt: true,
};
export async function registerUser(data, apiBaseUrl) {
    const email = data.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error("Email already exists");
    }
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
        data: {
            fullName: data.fullName.trim(),
            email,
            password: hashedPassword,
            emailVerified: false,
        },
        select: userSelect,
    });
    await createDefaultCategoriesForUser(user.id);
    let emailSent = true;
    try {
        await issueEmailVerification({
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            apiBaseUrl,
        });
    }
    catch {
        emailSent = false;
    }
    return { ...user, emailSent };
}
export async function loginUser(data) {
    const email = data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user || !user.password) {
        throw new Error("Invalid email or password");
    }
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    if (!user.emailVerified && !user.googleId) {
        throw new Error("Please verify your email");
    }
    const { password: _password, googleId: _googleId, ...safeUser } = user;
    const token = generateToken(user.id);
    return {
        user: safeUser,
        token,
    };
}
//# sourceMappingURL=auth.service.js.map