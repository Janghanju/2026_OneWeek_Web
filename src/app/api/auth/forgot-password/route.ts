import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        // Always return success to prevent email enumeration
        if (!user) {
            console.log(`[PASSWORD RESET] No user found for email: ${email}`);
            return NextResponse.json({
                success: true,
                message: "If the email exists, a reset link has been sent."
            });
        }

        // Check if user has a password (not OAuth-only)
        if (!user.password) {
            console.log(`[PASSWORD RESET] OAuth-only user: ${email}`);
            return NextResponse.json({
                success: true,
                message: "If the email exists, a reset link has been sent."
            });
        }

        // Delete any existing reset tokens for this email
        await prisma.passwordResetToken.deleteMany({
            where: { email: email.toLowerCase() }
        });

        // Generate reset token
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save token to database
        await prisma.passwordResetToken.create({
            data: {
                email: email.toLowerCase(),
                token,
                expiresAt
            }
        });

        // Send email
        await sendPasswordResetEmail(email, token);

        return NextResponse.json({
            success: true,
            message: "If the email exists, a reset link has been sent."
        });

    } catch (error: any) {
        console.error("[PASSWORD RESET ERROR]", error);

        // If table doesn't exist, return gracefully
        if (error.code === 'P2021' || error.message?.includes('does not exist')) {
            return NextResponse.json({
                success: true,
                message: "If the email exists, a reset link has been sent."
            });
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
