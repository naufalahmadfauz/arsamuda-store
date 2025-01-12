"use client"

import {ColumnDef} from "@tanstack/react-table"
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {useAction} from "next-safe-action/hooks";
import {deleteProduct} from "@/server/actions/delete-product";
import { toast } from "sonner";
import Link from "next/link";
import {VariantsWithImagesTags} from "@/lib/infer-type";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ProductColumn = {
    title: string,
    price: number,
    image: string,
    variants: VariantsWithImagesTags[],
    id: number
}


const ActionCell = ({row}:{row: Row<ProductColumn>})=>{
    const product = row.original
    const {execute} = useAction(deleteProduct,{
        onSuccess:(data)=>{
            if (data?.success) toast.success(`Produk ${product.title} berhasil dihapus`)
            if (data?.error) toast.error('Gagal menghapus produk')
        },
        onError:()=>{
            toast.error('Terjadi Kesalahan.')
        },
        onExecute:()=>{
            toast.loading('Menghapus produk...')
        }
    })
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true} >
                <Button variant={'ghost'} className={'h-8 w-8 p-0'}>
                    <MoreHorizontal className={'h-4 w-4'}/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className={'cursor-pointer dark:focus:bg-primary focus:bg-primary/50'}><Link href={`/dashboard/add-product?id=${product.id}`}>
                    Edit Product
                </Link></DropdownMenuItem>
                <DropdownMenuItem onClick={()=> execute({id:product.id})} className={'cursor-pointer dark:focus:bg-destructive focus:bg-destructive/50'} >Hapus Produk</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "id",
        header: "ID",
    }, {
        accessorKey: "title",
        header: "Judul",
    }, {
        accessorKey: "variants",
        header: "Jenis / Variasi",
        cell:(({row})=>{
            const variants = row.getValue('variants') as VariantsWithImagesTags[]
        })
    }, {
        accessorKey: "price",
        header: "Harga",
        cell: ({row}) => {
            const price = parseFloat(row.getValue('price'))
            const formatted = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(price)
            return (<div className={'font-medium text-xs'}>{formatted}</div>)
        }
    },
    {
        accessorKey: "image",
        header: "Gambar",
        cell: ({row}) => {
            const cellImage = row.getValue('image') as string
            const cellTitle = row.getValue('title') as string
            return (
                <div className={'w-12 h-12'}>
                    <Image src={cellImage} alt={cellTitle} className={'rounded-md'} width={50} height={50}/>
                </div>
            )
        }
    }, {
        id: "actions",
        header: "Aksi",
        cell: ActionCell,
    },
]
