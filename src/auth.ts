import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Mock user for demonstration
                if (credentials?.email === "user@example.com" && credentials?.password === "password") {
                    return {
                        id: "1",
                        name: "Demo User",
                        email: credentials.email,
                    }
                }
                return null
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    secret: process.env.AUTH_SECRET || "debug_secret",
}
