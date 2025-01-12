'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Session} from "next-auth";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import Image from 'next/image'

type SettingsForm = {
    session: Session
}
import {SettingsSchema} from "@/types/settings-schema";
import {Switch} from "@/components/ui/switch";
import {FormError} from "@/components/auth/form-error";
import {FormSuccess} from "@/components/auth/form-success";
import {useState} from "react"
import {useAction} from "next-safe-action/hooks";
import {settings} from "@/server/actions/settings";
import {UploadButton} from "@/app/api/uploadthing/upload";

export default function SettingsCard(session: SettingsForm) {
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: session.session.user?.name || undefined,
            email: session.session.user?.email || undefined,
            isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
            image: session.session.user?.image || undefined
        }
    })

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [avatarUploading, setAvatarUploading] = useState(false)
    const {execute, status} = useAction(settings, {
        onSuccess: (data) => {
            if (data?.success) return setSuccess(data.success)
            if (data?.error) return setError(data.error)
        },
        onError: () => {
            return setError('Galat terjadi')

        }

    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        execute(values)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
                <CardDescription>Ubah pengaturan akun anda</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Nama</FormLabel>
                                    <FormControl>
                                        <Input disabled={status === 'executing'} placeholder="Arsamuda" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Nama yang akan ditampilkan di akun anda
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    <div className={'flex items-center gap-4'}>
                                        {!form.getValues('image') && (
                                            <div className={'font-bold'}>
                                                {session.session.user?.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}
                                        {form.getValues('image') && (
                                            <Image src={form.getValues('image')!} alt='Gambar user' height={32}
                                                   width={32} className={'rounded-full'}/>
                                        )}
                                        <UploadButton onUploadBegin={() => {
                                            setAvatarUploading(true)
                                        }}
                                                      onUploadError={(error) => {
                                                          form.setError('image', {
                                                              type: 'validate',
                                                              message: error.message
                                                          })
                                                          setAvatarUploading(false)
                                                          return
                                                      }}
                                                      onClientUploadComplete={(res) => {
                                                          form.setValue('image', res[0].url)
                                                          setAvatarUploading(false)
                                                          return
                                                      }}
                                                      className={'scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden'}
                                                      endpoint={'avatarUploader'} content={{
                                            button({ready}) {
                                                if (ready) return <div> Ganti Gambar </div>
                                                return <div> Memproses </div>
                                            }
                                        }}/>
                                    </div>

                                    <FormControl>
                                        <Input type={'hidden'} disabled={status === 'executing'}
                                               placeholder="Gambar" {...field} />
                                    </FormControl>

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
                                        <Input disabled={status === 'executing' || session?.session.user.isOauth}
                                               placeholder="*******" {...field} />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password Baru</FormLabel>
                                    <FormControl>
                                        <Input disabled={status === 'executing' || session?.session.user.isOauth}
                                               placeholder="*******" {...field} />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel><i>Two Factor Authentication</i></FormLabel>
                                    <FormDescription>
                                        Kirim email setiap kali anda masuk ke akun anda
                                    </FormDescription>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange}
                                                disabled={status === 'executing' || session.session.user.isOauth === true}/>
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <Button disabled={status === 'executing' || avatarUploading} type={'submit'}>Simpan</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}