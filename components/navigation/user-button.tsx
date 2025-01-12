'use client'

import {Session} from "next-auth";
import {signOut} from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {LogOut, Moon, Settings, Sun, TruckIcon} from "lucide-react";
import {useTheme} from "next-themes";
import React from "react";
import {Switch} from "@/components/ui/switch";
import {useRouter} from "next/navigation";

export const UserButton = ({user}: Session) => {
    const {theme, setTheme} = useTheme()
    const [checked, setChecked] = React.useState(false)
    const router = useRouter()
    function setSwitchState() {
        switch (theme) {
            case 'dark':
                return setChecked(true);
            case 'light':
                return setChecked(false);
            case 'system':
                return setChecked(false);
        }
    }
    if (user)
        return (
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                    <Avatar>
                        {user?.image && (
                            <Image src={user.image} alt={user.name || 'Avatar'} width={32} height={32}
                                   className={'rounded-full'}/>
                        )} 
                        {!user?.image && (
                            <AvatarFallback className={'bg-primary/15'}>
                                <div className={'font-bold'}>
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>

                            </AvatarFallback>
                        )}
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'w-64 p-6'} align={'end'}>
                    <div className={'mb-4 p-4 flex flex-col items-center rounded-lg bg-primary/25 gap-1 '}>
                        {user?.image && (
                            <Image src={user.image} alt={user.name!} width={36} height={36}
                                   className={'rounded-full'}/>
                        )}
                        <p className={'font-bold text-xs'}> {user?.name}</p>
                        <span className={'text-xs font-medium text-secondary-foreground'}>{user?.email}</span>
                    </div>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={()=>router.push('/dashboard/orders')} className={'group py-2 font-medium cursor-pointer '}>
                        <TruckIcon size={14}
                                   className={'group-hover:translate-x-1 transition-all duration-300 ease-in-out mr-2'}/> Pesanan
                        Saya
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={()=>{router.push('/dashboard/settings')}} className={'group py-2 font-medium cursor-pointer '}>
                        <Settings size={14}
                                  className={'mr-2 group-hover:rotate-180 transition-all duration-300 ease-in-out'}/>{" "} Pengaturan
                    </DropdownMenuItem>
                    {theme && (
                        <DropdownMenuItem className={'py-2 font-medium cursor-pointer '}>
                            <div onClick={(e)=>e.stopPropagation()} className={'flex items-center group'}>
                                <div className={'relative flex mr-3'}>
                                    <Sun
                                        className={'absolute group-hover:text-yellow-600 group-hover:rotate-180 dark:scale-0 dark:-rotate-90 transition-all duration-500 ease-in-out'}
                                        size={14}/>
                                    <Moon className={'group-hover:text-blue-400 dark-scale dark:scale-100 scale-0'}
                                          size={14}/>
                                </div>
                                <p className={'dark:text-blue-400 text-secondary-foreground/75 text-yellow-600 '}>
                                    {theme[0].toUpperCase() + theme.slice(1)} Mode
                                </p>
                                <Switch className={'scale-75 ml-2'} checked={checked} onCheckedChange={(e) => {
                                    setChecked((prev) => !prev)
                                    if (e) setTheme('dark')
                                    if (!e) setTheme('light')
                                }}/>
                            </div>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={() => signOut()}
                                      className={'py-2 group focus:bg-destructive/25 font-medium cursor-pointer '}>

                        <LogOut size={14}
                                className={'mr-3 group-hover:scale-75 transition-all duration-300 ease-in-out'}/>
                        Keluar

                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        )
}