"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, FileText, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface NavbarLinksProps {
    role?: string;
}

export function NavbarLinks({ role }: NavbarLinksProps) {
    const pathname = usePathname();

    const routes = [
        {
            href: "/companies",
            label: "Companies",
            icon: Building2,
            active: pathname.startsWith("/companies"),
            color: "text-blue-600",
            bg: "bg-blue-500/10"
        },
        {
            href: "/bills/create",
            label: "Entry Bill",
            icon: FileText,
            active: pathname === "/bills/create",
            color: "text-emerald-600",
            bg: "bg-emerald-500/10"
        },
        {
            href: "/boss",
            label: "Boss View",
            icon: UserCircle,
            active: pathname.startsWith("/boss"),
            color: "text-indigo-600",
            bg: "bg-indigo-500/10",
            adminOnly: true
        }
    ];

    const filteredRoutes = routes.filter(route => !route.adminOnly || role === 'admin');

    return (
        <div className="flex items-center gap-1 sm:gap-2">
            {filteredRoutes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className="relative group px-3 py-2"
                >
                    <div className={cn(
                        "flex items-center gap-2 relative z-10 transition-colors duration-300",
                        route.active ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"
                    )}>
                        <route.icon className={cn(
                            "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                            route.active ? route.color : ""
                        )} />
                        <span className="hidden lg:inline font-bold tracking-tight text-sm uppercase">
                            {route.label}
                        </span>
                    </div>

                    {route.active && (
                        <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 bg-slate-100 rounded-xl -z-0 shadow-sm ring-1 ring-slate-200/50"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}

                    {!route.active && (
                        <div className="absolute inset-0 bg-slate-50 rounded-xl -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                </Link>
            ))}
        </div>
    )
}
