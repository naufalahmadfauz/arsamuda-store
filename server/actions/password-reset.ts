'use server'

import {createSafeActionClient} from "next-safe-action";
import {ResetSchema} from "@/types/reset-schema";
import {db} from "@/server";
import { eq } from "drizzle-orm";
import {users} from "@/server/schema";
import {generatePasswordResetToken} from "@/server/actions/tokens";
import {sendPasswordResetEmail} from "@/server/actions/email";

const action = createSafeActionClient()
export const reset = action(ResetSchema, async ({email}) => {
    const existinguser = await db.query.users.findFirst({
        where:eq(users.email,email)
    })
    if (!existinguser) return {error:"User tidak ditemukan"}
    const passwordResetToken = await generatePasswordResetToken(email)
    if (!passwordResetToken) {
        return {error:"Token tidak bisa dibuat"}
    }
    await sendPasswordResetEmail(passwordResetToken[0].email, passwordResetToken[0].token)
    return {success:"Email reset password berhasil dikirim"}
})