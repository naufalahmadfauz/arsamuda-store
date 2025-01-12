import {BarChart, Package, PenSquare, Settings, TruckIcon} from "lucide-react";
import {auth} from "@/server/auth";


import DashboardNav from "@/components/navigation/dashboard-nav";

export default async function DashboardLayout({children}: { children: React.ReactNode }) {

    const session = await auth()

    const userLinks = [
        {
            label: 'Pesanan',
            path: '/dashboard/orders',
            icon: <TruckIcon size={16}/>
        },
        {
            label: 'Pengaturan',
            path: '/dashboard/settings',
            icon: <Settings size={16}/>
        }] as const
    const adminLinks = session?.user.role === 'admin' ? [
        {
            label: 'Analisa',
            path: '/dashboard/analytics',
            icon: <BarChart size={16}/>
        }, {
            label: 'Buat Produk',
            path: '/dashboard/add-product',
            icon: <PenSquare size={16}/>
        }, {
            label: 'Produk',
            path: '/dashboard/products',
            icon: <Package size={16}/>
        }] : []
    
    const allLinks = [ ...adminLinks,...userLinks]

    return (
        <div>
            <DashboardNav allLinks={allLinks}/>
            <h1>Layout</h1>
            {children}
        </div>
    )
}