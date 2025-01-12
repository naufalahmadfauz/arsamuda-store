import NextAuth from "next-auth"
import {DrizzleAdapter} from "@auth/drizzle-adapter"
import {db} from "@/server"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import {LoginSchema} from "@/types/login-schema";
import {accounts, users} from "@/server/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcrypt";

export const {handlers, auth, signIn, signOut} = NextAuth({
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    session: {strategy: "jwt"},
    callbacks: {
        async session({session, token}) {
            if (session && token.sub) {
                session.user.id = token.sub
            }
            if (session.user && token.role) {
                session.user.role = token.role as string
            }
            if (session.user){
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
                session.user.isOauth = token.isOauth as boolean
                session.user.image = token.image as string
                session.user.name = token.name 
                session.user.email = token.email as string
            }
            return session
        },
        async jwt({token}) {
            if (!token.sub) return token
            const existingUser = await db.query.users.findFirst({
                where: eq(users.id, token.sub)
            })

            if (!existingUser) return token
            const existingAccount = await db.query.accounts.findFirst({
                where: eq(accounts.userId, existingUser.id),
            })

            token.isOauth = !!existingAccount
            token.name = existingUser.name
            token.email = existingUser.email
            token.image = existingUser.image
            token.role = existingUser.role
            token.isTwoFactorEnabled = existingUser.twoFactorEnabled
            return token
        }
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            authorize: async (credentials) => {
                const validatedFields = LoginSchema.safeParse(credentials)
                if (validatedFields.success) {
                    const {email, password} = validatedFields.data
                    const user = await db.query.users.findFirst({
                        where: eq(users.email, email)
                    })
                    if (!user || !user.password) return null
                    const passwordMatch = await bcrypt.compare(password, user.password)
                    if (passwordMatch) return user

                }
                return null
            }
        }),
    ],
})