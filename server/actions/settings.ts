'use server'

import {createSafeActionClient} from "next-safe-action";
import {SettingsSchema} from "@/types/settings-schema";
import {auth} from "@/server/auth";
import {db} from "@/server";
import { eq } from "drizzle-orm";
import {users} from "@/server/schema";
import bcrypt from "bcrypt";
import {revalidatePath} from "next/cache";

const action = createSafeActionClient()
export const settings = action(SettingsSchema, async (values) => {
    const user = await auth()
    if (!user) return {error: "User tidak ditemukan"}
    const dbUser = await db.query.users.findFirst({
        where:eq(users.id, user.user.id)
    })
    if (!dbUser) return {error: "User tidak ditemukan"}
    if (user.user.isOauth){
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.isTwoFactorEnabled = undefined
    }
    if(values.password && values.newPassword && dbUser.password){
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password)
        if (!passwordMatch) return {error: "Password tidak cocok!"}
        const samePassword = await bcrypt.compare(values.newPassword, dbUser.password)
        if (samePassword) return {error: "Password tidak boleh sama dengan password sebelumnya!"}
        const hashedPassword = await bcrypt.hash(values.newPassword, 10)
        values.password = hashedPassword
        values.newPassword = undefined
       
    } await db.update(users).set({
        name: values.name,
        password: values.password,
        email: values.email,
        image: values.image,
        twoFactorEnabled: values.isTwoFactorEnabled
    }).where(eq(users.id, dbUser.id))
    revalidatePath('/dashboard/settings')
    return {success: "Berhasil memperbarui data!"}
})