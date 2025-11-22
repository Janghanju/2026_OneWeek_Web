import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub,
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
                    // Mock user for demonstration
                    if (parsedCredentials.data.email === "user@example.com" && parsedCredentials.data.password === "password") {
                        return {
                            id: "1",
                            name: "Demo User",
                            email: parsedCredentials.data.email,
                        }
                    }
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
})
