import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Find the reset token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetToken) {
            return NextResponse.json(
                { error: "Invalid or expired reset link" },
                { status: 400 }
            );
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
            // Delete expired token
            await prisma.passwordResetToken.delete({
                where: { id: resetToken.id }
            });
            return NextResponse.json(
                { error: "Reset link has expired. Please request a new one." },
                { status: 400 }
            );
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // Delete the used token
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id }
        });

        console.log(`[PASSWORD RESET SUCCESS] User: ${user.email}`);

        return NextResponse.json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error: any) {
        console.error("[PASSWORD RESET ERROR]", error);

        // If table doesn't exist, return error gracefully
        if (error.code === 'P2021' || error.message?.includes('does not exist')) {
            return NextResponse.json(
                { error: "Password reset is temporarily unavailable" },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
