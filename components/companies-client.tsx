"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Building2, Calendar, Search, Users, MapPin, Briefcase, Fingerprint, ShieldCheck, Zap, Globe, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ y: -10 }}
                            className="group relative h-full"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <Card className="relative h-full bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col group-hover:shadow-[0_48px_80px_-20px_rgba(37,99,235,0.15)] transition-all duration-500 ring-1 ring-slate-100/50">

                                {/* Decorative Technical Grid */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full"></div>

                                {/* Identity Card Stripe */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 opacity-80"></div>

                                <CardHeader className="p-8 pb-4 relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="relative">
                                            <div className="absolute -inset-2 bg-blue-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>
                                            <div className="relative w-16 h-16 bg-slate-900 rounded-2xl shadow-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500">
                                                <Building2 className="h-8 w-8 text-blue-400" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-100 font-black px-3 py-1 rounded-full text-[10px] tracking-widest uppercase italic">
                                                ACTIVE ASSET
                                            </Badge>
                                            <div className="flex gap-1">
                                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-100"></div>)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <CardTitle className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic group-hover:text-blue-600 transition-colors duration-300">
                                            {company.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 group/id">
                                            <Fingerprint className="w-3 h-3 text-slate-300 group-hover/id:text-blue-400 transition-colors" />
                                            <CardDescription className="font-mono tracking-tighter text-[10px] text-slate-400 uppercase">
                                                CID: <span className="text-slate-600 font-bold tracking-normal italic">{company.id.toUpperCase().slice(0, 14)}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8 pt-4 flex flex-col justify-between flex-grow gap-8 relative z-10">
                                    {/* Verification Matrix */}
                                    <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 flex items-center justify-between group-hover:bg-blue-50/50 transition-colors duration-500">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security Context</p>
                                                <p className="text-sm font-black text-slate-900 uppercase italic leading-none">IDENTITY VERIFIED</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Issue Date</span>
                                            <div className="flex items-center gap-2 text-slate-900 font-black italic text-sm tracking-tighter uppercase whitespace-nowrap">
                                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                {new Date(company.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div className="space-y-2 border-l border-slate-100 pl-6">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none text-right block">Registry Loc</span>
                                            <div className="flex items-center justify-end gap-2 text-slate-900 font-black italic text-sm tracking-tighter uppercase">
                                                <Globe className="w-3.5 h-3.5 text-blue-500" />
                                                DM-NODE-01
                                            </div>
                                        </div>
                                    </div>

                                    <Link href={`/companies/${company.id}`} className="block mt-2">
                                        <Button className="w-full h-14 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-[0_16px_32px_-8px_rgba(15,23,42,0.15)] group-hover:shadow-[0_16px_32px_-8px_rgba(37,99,235,0.25)] flex items-center justify-between px-6 font-black italic tracking-widest text-[11px] group-hover:gap-4">
                                            <div className="flex items-center gap-3">
                                                <Lock className="w-4 h-4 text-blue-400" />
                                                AUTHORIZE ACCESS
                                            </div>
                                            <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
                                                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Button>
                                    </Link>
                                </CardContent>

                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"></div>
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
