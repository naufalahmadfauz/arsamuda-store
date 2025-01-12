'use client'

import {AuthCard} from "@/components/auth/auth-card";
import {Form, FormField, FormItem, FormLabel, FormMessage, FormDescription, FormControl} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RegisterSchema} from "@/types/register-schema";
import * as z from "zod"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useAction} from "next-safe-action/hooks";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {emailRegister} from "@/server/actions/email-register";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";



export const RegisterForm = () => {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ''
        }
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    
    const {execute,status} = useAction(emailRegister,{
        onSuccess(data){
            if(data.error) setError(data.error)
            if (data.success) setSuccess(data.success)
        }
    })


    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values)
    }
    return (
        <AuthCard cardTitle="Buat Akun Baru" backButtonHref="/auth/login" backButtonLabel="Sudah Terdaftar? Masuk!"
                  showSocials>
            <div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="arsamuda" type="text"/>
                                    </FormControl>
                                    <FormDescription/>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        /><FormField
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
                        <FormSuccess message={success}/>
                        <FormError message={error}/>
                        
                        <Button size={'sm'} variant="link" asChild>
                            <Link href={"/auth/reset"}>Lupa Password?</Link>
                        </Button>
                    </div>
                    <Button type="submit" className={cn('w-full', status === 'executing' ? 'animate-pulse' : '')}>
                        {"Daftar"}
                    </Button>
                </form>
            </Form>
        </AuthCard>
    )
}