'use server'

import {newPasswordSchema} from "@/types/new-password-schema";
import {createSafeActionClient} from "next-safe-action";
import {getPasswordResetTokenByToken} from "@/server/actions/tokens";
import { eq } from "drizzle-orm";
import {db} from "@/server";
import {passwordResetTokens, users} from "../schema";
import bcrypt from "bcrypt";
import {Pool} from "@neondatabase/serverless"
import {drizzle} from "drizzle-orm/neon-serverless"

const action = createSafeActionClient()

export const newPassword = action(newPasswordSchema, async ({password, token}) => {
    //cek ada token
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL
    })
    const dbPool = drizzle(pool)
    
    if (!token) {
        return {error: "Token tidak ditemukan"}
    }
    const existingToken = await getPasswordResetTokenByToken(token)
    if (!existingToken) return {error:"Token tidak ditemukan"}
    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) return {error:"Token sudah kadaluarsa"}
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })
    if (!existingUser) return {error:"User tidak ditemukan"}
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await dbPool.transaction(async (tx) => {
        await tx.update(users).set({
            password: hashedPassword
        }).where(eq(users.id, existingUser.id))
        await tx.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
    })
    return {success:"Password berhasil diubah"}
    
})