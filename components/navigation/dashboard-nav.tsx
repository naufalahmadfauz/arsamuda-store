'use client'
import Link from "next/link";
import {cn} from "@/lib/utils";
import {motion, AnimatePresence} from "framer-motion";
import {usePathname} from "next/navigation";

export default function DashboardNav({allLinks}: {
    allLinks: { label: string, path: string, icon: React.ReactNode }[]
}) {
    const pathname = usePathname()
    
    return (
        <nav className={'py-2 overflow-auto mb-4'}>
            <ul className={'flex gap-6 text-xs font-semibold'}>
                <AnimatePresence>
                {allLinks.map(({label, path, icon}) => (
                    <motion.li whileTap={{scale:0.95}} key={path}>
                        <Link className={cn('relative flex gap-1 flex-col items-center', pathname === path &&'text-primary' )} href={path}>
                            {icon}
                            {label}
                            {pathname===path ? (<motion.div layoutId={'underline'} transition={{type:'spring',stiffness:35}}  initial={{scale:0.8}} animate={{scale:1}} className={'h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1'}/>) : null}
                        </Link>
                    </motion.li>
                ))}
                </AnimatePresence>
            </ul>
        </nav>
    )

}

