import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id?: string
            role?: string
            membership?: string
        } & DefaultSession["user"]
    }

    interface User {
        id?: string
        role?: string
        membership?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
        id?: string
        membership?: string
    }
}
