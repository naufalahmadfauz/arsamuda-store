import {auth} from "@/server/auth"
import {UserButton} from "@/components/navigation/user-button";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {LogIn} from "lucide-react";
import Logo from "@/components/navigation/logo"
export default async function Nav() {
    const session = await auth()
    return (
        <header className="py-8">
            <nav>
                <ul className="flex justify-between items-center">
                    <li>
                        <Link aria-label={"Arsamuda Store"} href={"/"}><Logo></Logo></Link>
                    </li>
                    {!session ? (
                        <li>
                            <Button asChild>
                                <Link className="flex gap-2" href={"/auth/login"}> <LogIn size={16} /><span>Login</span> </Link>
                            </Button>
                        </li>
                    ) : (
                        <li><UserButton expires={session?.expires} user={session?.user}/></li>
                    )}
                </ul>
            </nav>
        </header>
    )
}
