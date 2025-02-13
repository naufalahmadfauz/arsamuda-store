import * as z from "zod";

export const VariantSchema = z.object({
    productID: z.number(),
    id: z.number(),
    editMode: z.boolean(),
    productType: z.string().min(3, {message: 'Produk harus lebih panjang dari 3 karakter'}),
    color: z.string().min(3, {message: 'Warna harus lebih panjang dari 3 karakter'}),
    tags: z.array(z.string()).min(1, {message: 'Tags harus lebih dari 1'}),
    variantImages: z.array(z.object({
        url: z.string().refine((url) => url.search('blob:') !== 0, {message: 'Tunggu gambar untuk diunggah'}),
        size:z.number(),
        key:z.string().optional(),
        id:z.number().optional(),
        name:z.string()
    }))
})