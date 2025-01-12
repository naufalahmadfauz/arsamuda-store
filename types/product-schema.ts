import * as z from "zod"

export const ProductSchema = z.object({
    id:z.number().optional(),
    title: z.string().min(5,{
        message:'Judul produk minimal 5 karakter'
    }),
    description: z.string().min(10,{
        message:'Deskripsi produk minimal 10 karakter'
    }),
    price: z.coerce.number({
        message:'Harga produk harus berupa angka'
    }).positive({
        message:'Harga produk harus positif'
    }).min(1000,{
        message:'Harga produk minimal 1000'
    }),
})

export type zProductSchema = z.infer<typeof ProductSchema>