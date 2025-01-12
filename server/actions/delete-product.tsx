'use server'

import {createSafeActionClient} from "next-safe-action"
import {z} from "zod";
import {db} from "@/server";
import {products} from "@/server/schema";
import { eq } from "drizzle-orm";
import {revalidatePath} from "next/cache";

const action = createSafeActionClient()

export const deleteProduct = action(z.object({id: z.number()}), async ({id}) => {
    try {
        const data = await db.delete(products).where(eq(products.id, id)).returning()
        
        revalidatePath('/dashboard/products')
        return {success:`Produk ${data[0].title} berhasil dihapus`}
    }catch (e) {
        return {error:'Gagal untuk menghapus produk'}
    }
})