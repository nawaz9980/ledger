import Link from "next/link"
import { NavbarLinks } from "@/components/navbar-links"
import { getSession } from "@/lib/auth"
import { logout } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="border-b border-slate-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl blur-sm opacity-25 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
                W
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-slate-900 uppercase leading-none">
                White<span className="text-blue-600">Tag</span>
              </span>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 leading-none mt-1">
                LEDGER SYSTEM
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-8">
            <NavbarLinks role={session?.user.role} />

            {session && (
              <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-sm font-black text-slate-900 tracking-tight leading-none italic">
                    {session.user.name}
                  </span>
                  <span className="text-[10px] font-black text-blue-600 tracking-widest mt-1 uppercase leading-none">
                    {session.user.role}
                  </span>
                </div>

                <div className="lg:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User className="w-4 h-4" />
                </div>

                <form action={logout}>
                  <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
