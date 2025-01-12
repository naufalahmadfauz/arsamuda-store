'use server'

import {createSafeActionClient} from "next-safe-action";
import {ProductSchema} from "@/types/product-schema";
import {db} from "@/server";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import {revalidatePath} from "next/cache";

const action = createSafeActionClient()

export const createProduct = action(ProductSchema, async ({description, price, title, id}) => {
    try {
        
        if (id) {
            const currentProduct = await db.query.products.findFirst({
                where:eq(products.id, id)
            })
            if (!currentProduct) return {error:'Produk tidak ditemukan!'}
            const editedProduct  = await db.update(products).set({
                description,
                price,
                title
            }).where(eq(products.id, id)).returning()
            revalidatePath("/dashboard/products")
            return {success:`Produk ${editedProduct[0].title} berhasil diedit!`}
        }
        if (!id) {
            const newProduct = await db.insert(products).values({
                description,
                price,
                title
            }).returning()
            revalidatePath("/dashboard/products")
            return {success:`Produk ${newProduct[0].title} berhasil ditambahkan!`}
        }
    } catch (e) {
        return {error:'Terjadi Kesalahan!'}
    }
})