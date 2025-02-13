'use client'

import {VariantsWithImagesTags} from "@/lib/infer-type";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useForm} from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {VariantSchema} from "@/types/variant-schema";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {InputTags} from "@/app/dashboard/products/input-tags"; 
export default function ProductVariant({editMode, productID, variant, children}: {
    editMode: boolean,
    productID?: number,
    variant?: VariantsWithImagesTags,
    children: React.ReactNode
}) {
    const form = useForm<z.infer<typeof VariantSchema>>({
        resolver: zodResolver(VariantSchema),
        defaultValues: {
            tags: [],
            variantImages: [],
            color:'#000000',
            editMode,
            id:undefined,
            productID,
            productType:'Black Notebook'
            
        },
        mode: 'onChange'
    })
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof VariantSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <div>
            <Dialog>
                <DialogTrigger>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editMode ? 'Edit' : 'Buat'} variasi baru</DialogTitle>
                        <DialogDescription>
                            Buat variasi baru atau edit disini.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="productType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul Variasi</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Pilih judul untuk variasi" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warna Variasi</FormLabel>
                                        <FormControl>
                                            <Input type={'color'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags variasi</FormLabel>
                                        <FormControl>
                                            <InputTags {...field} onChange={(e)=>field.onChange(e)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/*<VariantImages/>*/}
                            {editMode && variant && (
                                <Button type={'button'} onClick={(e)=>e.preventDefault()} >
                                    Hapus Variasi
                                </Button>
                            ) }
                            <Button type="submit">{editMode ? 'Update Variasi' : 'Buat Variasi'}</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

        </div>
    )
}