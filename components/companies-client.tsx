"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Building2, Calendar, Search, Users, MapPin, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CompaniesClientProps {
    initialCompanies: any[]
}

export function CompaniesClient({ initialCompanies }: CompaniesClientProps) {
    const [search, setSearch] = useState("")

    const filteredCompanies = initialCompanies.filter(company =>
        company.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-10 max-w-7xl mx-auto px-4 py-12">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none uppercase italic">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Registry</span>
                    </h1>
                    <p className="text-slate-500 mt-4 text-xl font-medium opacity-80 max-w-xl italic">
                        Your secure vault of authenticated client identities and financial ledger histories.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative w-full lg:max-w-md group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
                    <div className="relative h-16">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Identify a company..."
                            className="pl-14 h-full bg-white border-slate-100 rounded-2xl shadow-xl group-focus-within:ring-2 group-focus-within:ring-blue-500/20 text-lg font-bold transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </motion.div>
            </header>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-6">
                <AnimatePresence mode="popLayout">
                    {filteredCompanies.map((company, index) => (
                        <motion.div
                            key={company.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="group relative h-full"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] blur opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <Card className="relative h-full bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                    <div className="flex items-start justify-between">
                                        <div className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                            <Building2 className="h-7 w-7 text-blue-600" />
                                        </div>
                                        <div className="bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                                            <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase italic">
                                                ACTIVE ASSET
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-1">
                                        <CardTitle className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase italic group-hover:text-blue-600 transition-colors">
                                            {company.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 font-bold tracking-widest text-[9px] text-slate-400 uppercase">
                                            ID: <span className="font-mono">{company.id.slice(0, 12)}</span>
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8 flex flex-col justify-between flex-grow gap-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Registered</span>
                                            <div className="flex items-center gap-2 text-slate-900 font-bold italic text-sm">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(company.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Level</span>
                                            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter inline-block shadow-sm shadow-emerald-100">
                                                Verified
                                            </div>
                                        </div>
                                    </div>

                                    <Link href={`/companies/${company.id}`} className="block">
                                        <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/10 group-hover:shadow-blue-500/20 flex items-center justify-between px-6 font-black italic tracking-tight text-lg">
                                            VIEW LEDGER HISTORY
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredCompanies.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 ring-1 ring-slate-100">
                            <Building2 className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase italic">No identity found</h3>
                        <p className="text-slate-500 font-bold max-w-sm mt-4 tracking-tight">Your query yielded no results in the registry. Try refining your parameters.</p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
