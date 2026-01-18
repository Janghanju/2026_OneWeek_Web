import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    // Only the master admin (hardcoded email) can change membership for now
    if (!session || session.user?.email !== 'hanju1215@naver.com') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { email, membership } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { membership },
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update membership" }, { status: 500 });
    }
}
