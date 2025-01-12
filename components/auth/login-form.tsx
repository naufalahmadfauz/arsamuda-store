'use client'
import {AuthCard} from "@/components/auth/auth-card";
import {Form, FormField, FormItem, FormLabel, FormMessage, FormDescription, FormControl} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema} from "@/types/login-schema";
import * as z from "zod"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {emailSignin} from "@/server/actions/email-signin";
import {useAction} from "next-safe-action/hooks";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export const LoginForm = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ''
        }
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showTwoFactor, setTwoFactor] = useState(false)
    const {execute, status} = useAction(emailSignin, {
        onSuccess(data) {
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
            if (data?.twoFactor) setTwoFactor(true)
        }
    })


    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        execute(values)
    }
    return (
        <AuthCard cardTitle="Selamat Datang!" backButtonHref="/auth/register" backButtonLabel="Buat Akun Baru"
                  showSocials>
            <div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>{" "} Kami telah mengirim kode konfirmasi untuk masuk ke akun
                                            anda.</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} disabled={status === 'executing'} {...field}> 
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0}/>
                                                    <InputOTPSlot index={1}/>
                                                    <InputOTPSlot index={2}/>
                                                    <InputOTPSlot index={3}/>
                                                    <InputOTPSlot index={4}/>
                                                    <InputOTPSlot index={5}/>
                                                </InputOTPGroup>
                                                
                                            </InputOTP>
                                                
                                                
                                        </FormControl>
                                        <FormDescription/>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />)}
                        {!showTwoFactor &&(
                            
                        
                        <>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="abc@example.com" type="email"
                                                   autoComplete="email"/>
                                        </FormControl>
                                        <FormDescription/>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="********" type="password"
                                                   autoComplete="current-password"/>
                                        </FormControl>
                                        <FormDescription/>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </>
                        )}
                        <FormSuccess message={success}/>
                        <FormError message={error}/>
                        <Button size={'sm'} variant="link" asChild>
                            <Link className={'px-0'} href={"/auth/reset"}>Lupa Password?</Link>
                        </Button>
                    </div>
                    <Button type="submit" className={cn('w-full my-4', status === 'executing' ? 'animate-pulse' : '')}>
                        {showTwoFactor  ? "Verifikasi":"Masuk"}
                    </Button>
                </form>
            </Form>
        </AuthCard>
    )
}