'use server'
import getBaseUrl from "@/lib/base-url";
import {Resend} from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
const domain = getBaseUrl()

export const sendVerificationEmail = async (email:string,token:string) => {
    
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [`${email}`],
        subject: 'Konfirmasi email arsamuda store',
        html: `<a href="${confirmLink}">Konfirmasi email anda</a>`,
    });

    if (error) return console.log(error)
    
    if (data) return console.log(data)
}

export const sendPasswordResetEmail = async (email:string,token:string) => {
    
    const confirmLink = `${domain}/auth/new-password?token=${token}`
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [`${email}`],
        subject: 'Arsamuda Store - Reset password anda',
        html: `<a href="${confirmLink}">Reset Password Anda</a>`,
    });

    if (error) return console.log(error)
    
    if (data) return console.log(data)
}

export const sendTwoFactorTokenByEmail = async (email:string,token:string) => {
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [`${email}`],
        subject: 'Kode untuk masuk ke akun anda',
        html: `Kode konfirmasi untuk masuk ke akun anda ${token}`,
    });

    if (error) return console.log(error)

    if (data) return console.log(data)
}