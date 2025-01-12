'use client'
import {AuthCard} from "@/components/auth/auth-card";
import {Form, FormField, FormItem, FormLabel, FormMessage, FormDescription, FormControl} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useAction} from "next-safe-action/hooks";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";

import {ResetSchema} from "@/types/reset-schema";
import {reset} from "@/server/actions/password-reset";

export default function ResetForm ()  {
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email:''
        }
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const {execute, status} = useAction(reset,{
        onSuccess(data){
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
        }
    })


    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        execute(values)
    }
    return (
        <AuthCard cardTitle="Lupa Kata Sandi?" backButtonHref="/auth/login" backButtonLabel="Kembali Ke Halaman Masuk"
                  showSocials>
            <div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="abc@example.com" type="email"
                                               autoComplete="email"
                                               disabled={status === 'executing'}
                                        />
                                    </FormControl>
                                    <FormDescription/>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormSuccess message={success} />
                        <FormError message={error} />
                        <Button size={'sm'} variant="link" asChild>
                            <Link href={"/auth/reset"}>Lupa Password?</Link>
                        </Button>
                    </div>
                    <Button type="submit" className={cn('w-full', status === 'executing' ? 'animate-pulse' : '')}>
                        {"Reset Password"}
                    </Button>
                </form>
            </Form>
        </AuthCard>
    )
}