import { db } from "@/server"
import {DataTable} from "@/app/dashboard/products/data-table";
import {columns} from "@/app/dashboard/products/columns";
import placeholder from "@/public/placeholder.svg";
export default async function Products(){
    const products = await db.query.products.findMany({
        orderBy:(products,{desc})=>[desc(products.id)]
    }) 
    
    if (!products) throw new Error ("Tidak ada produk!")
    const dataTable = products.map((product)=>{
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            variants:[],
            image:placeholder.src
        }
    })
    if(!dataTable) throw new Error("Tidak ada data!")
    return (
        <div>
            <DataTable columns={columns} data={dataTable}/>
        </div>
    )
}