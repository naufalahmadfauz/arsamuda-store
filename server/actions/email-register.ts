'use server'
import {db} from "@/server";
import {createSafeActionClient} from "next-safe-action";
import {RegisterSchema} from "@/types/register-schema";
import bcrypt from "bcrypt";
import {users} from "@/server/schema";
import {eq} from "drizzle-orm";
import {generateEmailVerificationToken} from "@/server/actions/tokens";
import {sendVerificationEmail} from "@/server/actions/email";
const action = createSafeActionClient()

export const emailRegister = action(RegisterSchema,async ({name,email,password})=>{
    //hash password
    const hashedPassword = await bcrypt.hash(password,10)
    //cek user sekarang
    const existingUser = await db.query.users.findFirst({
        where:eq(users.email, email),
    })
    //cek email sudah terdaftar di database 
    if(existingUser){
        if (!existingUser.emailVerified){
            const verificationToken =  await generateEmailVerificationToken(email)
            await sendVerificationEmail(verificationToken[0].email,verificationToken[0].token)
            return {success:"Email sudah terdaftar, silahkan verifikasi email anda"}
        }
        return {error:"Email sudah terdaftar"}
    }
    
    
    
    const verificationToken = await generateEmailVerificationToken(email)
    await sendVerificationEmail(verificationToken[0].email,verificationToken[0].token)

    await db.insert(users).values({
        name,
        email,
        password:hashedPassword,

    })
    return {success:"Verifikasi email anda"}
})