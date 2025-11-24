import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const email = "user@example.com";
        const password = "password";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: hashedPassword,
                name: "Demo User",
                role: "USER"
            }
        });

        const adminEmail = "admin@example.com";
        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                password: hashedPassword,
                name: "Admin User",
                role: "ADMIN"
            }
        });

        return NextResponse.json({ message: "Seeded successfully", user, admin });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
