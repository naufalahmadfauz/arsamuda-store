'use server'

import {db} from "@/server";
import {products} from "@/server/schema";
import { eq } from "drizzle-orm";
export async function getProduct(id:number){
    try {
        const product = await db.query.products.findFirst({
            where:eq(products.id, id)
        })
        if (!product) throw new Error("Produk tidak ditemukan!")
        
        return {success:product}
    }catch (e) {
        return {error:'Gagal mendapatkan produk!'}
    }
}