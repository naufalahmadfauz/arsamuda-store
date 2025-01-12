'use client'

import {useSearchParams,useRouter} from "next/navigation";

import {useCallback, useEffect, useState} from "react";
import {newVerification} from "@/server/actions/tokens";
import {AuthCard} from "@/components/auth/auth-card";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";

export const EmailVerificationForm = () => {
    const token = useSearchParams().get("token")
    const router = useRouter()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    
    const handleVerification = useCallback(() => {
        if (success || error) return
        if (!token) return setError("Token tidak ditemukan")
        newVerification(token).then((data) => {
            if (data.error) return setError(data.error)
            if (data.success) {
                setSuccess(data.success)
                return router.push("/auth/login")
            }
        })
    }, [])

    useEffect(() => {
        handleVerification()
    }, []);

    return <AuthCard cardTitle="Verifikasi Akun Anda" backButtonHref="/auth/login" backButtonLabel="Kembali Ke Masuk">
        <div className="flex items-center flex-col w-full justify-center">
            <p>{!success && !error ? 'Verifying Email..' : ''}</p>
            <FormSuccess message={success}/>
            <FormError message={error}/>
        </div>
    </AuthCard>


}