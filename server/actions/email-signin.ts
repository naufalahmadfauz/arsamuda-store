"use server"
import {createSafeActionClient} from "next-safe-action";
import {LoginSchema} from "@/types/login-schema";
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {twoFactorTokens, users} from "@/server/schema";
import {
    generateEmailVerificationToken,
    generateTwoFactorToken,
    getTwoFactorTokenByEmail
} from "@/server/actions/tokens";
import {sendTwoFactorTokenByEmail, sendVerificationEmail} from "@/server/actions/email";
import {signIn} from "@/server/auth";
import {AuthError} from "next-auth";

const action = createSafeActionClient()

export const emailSignin = action(LoginSchema, async ({email, password, code}) => {
    try {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (existingUser?.email !== email) {
            return {error: "User tidak ditemukan"}
        }

        //kalau user belum verifikasi email tidak bisa login
        if (!existingUser?.emailVerified) {
            const verificationToken = await generateEmailVerificationToken(email)
            await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
            return {success: 'Konfirmasi email berhasil dikirim!'}
        }
        
        if (existingUser.twoFactorEnabled && existingUser.email){
            if(code){
                const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
                if (!twoFactorToken) return {error: "Token tidak ditemukan"}
                if (twoFactorToken.token !== code) return {error: "Token tidak valid"}
                const hasExpired = new Date(twoFactorToken.expires) < new Date()
                if (hasExpired) return {error: "Token kadaluarsa"}
                await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id))
                
                
            }else {
                const token = await generateTwoFactorToken(existingUser.email)
                if (!token) return {error: "Gagal mengirim token"}

                await sendTwoFactorTokenByEmail(token[0].email, token[0].token)
                return {twoFactor: 'Kode konfirmasi berhasil dikirim!'}
            }
        }
        
        await signIn('credentials', {email, password,redirectTo: '/'})
        return {success: 'Login berhasil'}
    } catch (e) {
        if (e instanceof AuthError) {
            switch (e.type){
                case "CredentialsSignin":
                    return {error:"Email atau password salah"}
                case "OAuthSignInError":
                    return {error:"Login dengan provider gagal"}
                default:
                    return {error:"Login gagal, coba lagi nanti."}
            }
        }
        throw e
    }

})