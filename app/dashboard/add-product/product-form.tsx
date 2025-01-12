'use client'

import {useForm} from "react-hook-form";
import {zProductSchema, ProductSchema} from '@/types/product-schema'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"

import {DollarSign} from "lucide-react";
import Tiptap from "@/app/dashboard/add-product/tiptap";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAction} from "next-safe-action/hooks";
import {createProduct} from "@/server/actions/create-product";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner"
import {useEffect} from "react";

import {getProduct} from "@/server/actions/get-product";
export default function ProductForm() {
    const form = useForm<zProductSchema>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0
        },
        mode: 'onChange'
    })
    const router = useRouter()
    const searchParams = useSearchParams()
    const editMode = searchParams.get('id')
    const checkProduct = async (id:number)=>{
        const data = await getProduct(id)
        if (editMode){
            const data = await getProduct(id)
            
            if(data.error){
                toast.error (data.error)
                router.push('/dashboard/products' )
                return
            }
            if(data.success){
                const id = parseInt(editMode)
                form.setValue('title', data.success.title)
                form.setValue('description', data.success.description)
                form.setValue('price', data.success.price)
                form.setValue('id', id)
            }
        }
    }
    useEffect(()=>{
        if(editMode){
            checkProduct(parseInt(editMode))
        }
    },[])
    
    const {execute, status} = useAction(createProduct, {
        onSuccess: (data) => {
            if (data?.success) {
                router.push('/dashboard/products')
                toast.success(data.success)
            }
            if (data?.error) {
                toast.error(data.error)
            }
        },
        onError: () => {
            toast.error('Terjadi Kesalahan!')

        },
        onExecute: () => {
            if(editMode){
                toast.loading('Merubah Produk...')
            }else toast.loading('Menambahkan produk...') 
            
        }
        
    })

    async function onSubmit(values: zProductSchema) {
        execute(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{editMode?  'Edit Produk' : 'Buat Produk'}</CardTitle>
                <CardDescription>{editMode ? 'Edit Produk Anda' : ' Buat Produk Baru'}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Judul Produk</FormLabel>
                                    <FormControl>
                                        <Input placeholder="RTX 5090" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Deskripsi Produk</FormLabel>
                                    <FormControl>
                                        {/*<Input placeholder="Deskripsi produk anda" {...field} />*/}
                                        <Tiptap val={field.value}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Harga Produk</FormLabel>
                                    <FormControl>
                                        <div className={'flex items-center gap-2'}>
                                            <DollarSign size={36} className={'p-2 bg-muted rounded-md '}/>
                                            <Input type={'number'} placeholder="Harga produk anda" {...field}
                                                   step={'500'} min={0}/>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty}
                                className={'w-full'} type="submit">{editMode ? 'Simpan Perubahan' : 'Buat Produk'}</Button>
                    </form>
                </Form>
            </CardContent>

        </Card>

    )
}