import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await prisma.user.findUnique({ where: { email } })
                    if (!user) return null

                    // For demo purposes, if no password set (first login), set it? 
                    // Or just check if password matches. 
                    // Since we don't have a signup page, we might need to seed a user or allow auto-signup on login?
                    // For this request, I'll assume standard flow: user must exist.
                    // But wait, the user said "demo: user@example.com". 
                    // I should probably allow creating the user if it doesn't exist for the demo simplicity, 
                    // OR just fail. 
                    // Let's implement standard check.

                    if (!user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password)
                    if (passwordsMatch) return user
                }

                return null
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as "USER" | "ADMIN";
            }
            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;
            const user = await prisma.user.findUnique({ where: { id: token.sub } });
            if (user) {
                token.role = user.role;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    }
})
