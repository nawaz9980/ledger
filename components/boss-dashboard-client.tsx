"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X, AlertTriangle, Clock, CalendarDays, Receipt, TrendingUp, Search, Filter } from "lucide-react"
import { differenceInDays, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { toggleBillStatus } from "@/actions/bill"

interface BossDashboardClientProps {
    initialBills: any[]
}

export function BossDashboardClient({ initialBills }: BossDashboardClientProps) {
    const [bills, setBills] = useState(initialBills)
    const [search, setSearch] = useState("")

    const filteredBills = bills.filter(bill =>
        (bill.type !== 'CREDIT') && (
            bill.company.name.toLowerCase().includes(search.toLowerCase()) ||
            bill.invoice_number.toLowerCase().includes(search.toLowerCase())
        )
    )

    const totalOutstanding = bills?.filter((b: any) => (b.type === 'DEBIT' || !b.type) && b.status === "PENDING").reduce((acc: number, b: any) => acc + Number(b.amount), 0) || 0;
    const criticalBills = bills?.filter((b: any) => {
        const daysAgo = differenceInDays(new Date(), new Date(b.date));
        return b.status === "PENDING" && daysAgo > 60;
    }).length || 0;

    const handleToggle = async (id: string, status: 'PENDING' | 'PAID') => {
        const result = await toggleBillStatus(id, status);
        if (result.success && result.data) {
            setBills(prev => prev.map(b => b.id === id ? { ...b, status: result.data!.status } : b));
        }
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">
                        Boss <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dashboard</span>
                    </h1>
                    <p className="text-slate-500 mt-3 text-lg font-medium opacity-80 max-w-md">
                        Real-time overview of your financial landscape and invoice performance.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap gap-4"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative px-6 py-4 bg-white ring-1 ring-slate-100 rounded-2xl flex items-center gap-4 min-w-[180px]">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Critical</p>
                                <p className="text-2xl font-black text-slate-900">{criticalBills}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative px-6 py-4 bg-white ring-1 ring-slate-100 rounded-2xl flex items-center gap-4 min-w-[220px]">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Outstanding</p>
                                <p className="text-2xl font-black text-slate-900">${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col md:flex-row gap-4 items-center justify-between"
            >
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Search by company or invoice #..."
                        className="pl-12 h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button variant="outline" className="h-12 rounded-xl bg-white border-slate-200 flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:border-slate-300">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Badge variant="outline" className="h-10 px-4 rounded-xl bg-slate-100 text-slate-600 border-none font-semibold">
                        Total {filteredBills.length}
                    </Badge>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
            >
                <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden ring-1 ring-slate-200/60">
                    <div className="overflow-x-auto max-h-[700px] overflow-y-auto scrollbar-hide border-t border-slate-200">
                        <table className="w-full text-left border-collapse min-w-[1000px] border-b border-slate-200">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-slate-50 border-b-2 border-slate-300">
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200">Date/Aged</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200">Client</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200">Type/Ref</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200 text-right">Debit (-)</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200 text-right">Credit (+)</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200 text-center">Status</th>
                                    <th className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                <AnimatePresence mode="popLayout">
                                    {filteredBills.map((bill, index) => {
                                        const date = new Date(bill.date);
                                        const daysAgo = differenceInDays(new Date(), date);
                                        const isOverdue = daysAgo > 60 && bill.status === "PENDING";

                                        return (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.1, delay: index * 0.01 }}
                                                key={bill.id}
                                                className={cn(
                                                    "transition-colors duration-200 group even:bg-slate-50/70 hover:bg-blue-50/50",
                                                    isOverdue && "bg-red-50/60 hover:bg-red-50/80"
                                                )}
                                            >
                                                <td className="px-6 py-4 align-middle border-r border-slate-200">
                                                    <div className="flex flex-col">
                                                        <span className={cn("text-sm font-black tabular-nums italic", isOverdue ? "text-red-900" : "text-slate-900")}>
                                                            {date.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                                                        </span>
                                                        <span className={cn("text-[9px] flex items-center gap-1.5 mt-0.5 font-black uppercase tracking-tighter leading-none", isOverdue ? "text-red-600" : "text-slate-400")}>
                                                            {daysAgo}D AGED
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-middle border-r border-slate-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs uppercase italic",
                                                            isOverdue ? "bg-red-600 text-white shadow-md shadow-red-100" : "bg-blue-600 text-white shadow-md shadow-blue-100"
                                                        )}>
                                                            {bill.company.name.charAt(0)}
                                                        </div>
                                                        <span className="font-black text-slate-900 text-sm tracking-tighter uppercase italic group-hover:translate-x-1 transition-transform">
                                                            {bill.company.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-middle border-r border-slate-200 font-mono text-[11px] font-black text-slate-600">
                                                    <div className="flex flex-col">
                                                        <Badge variant="outline" className={cn(
                                                            "mb-1 px-2 py-0 h-4 w-fit rounded text-[8px] font-black uppercase tracking-tighter",
                                                            bill.type === 'DEBIT' || !bill.type ? "text-red-600 border-red-100 bg-red-50/50" : "text-emerald-600 border-emerald-100 bg-emerald-50/50"
                                                        )}>
                                                            {bill.type || 'DEBIT'}
                                                        </Badge>
                                                        {bill.invoice_number}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-right border-r border-slate-200">
                                                    {(bill.type === 'DEBIT' || !bill.type) ? (
                                                        <span className="text-lg font-black text-red-600 tabular-nums tracking-tighter">
                                                            -${Number(bill.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    ) : <span className="text-slate-200">—</span>}
                                                </td>
                                                <td className="px-6 py-4 align-middle text-right border-r border-slate-200">
                                                    {bill.type === 'CREDIT' ? (
                                                        <span className="text-lg font-black text-emerald-600 tabular-nums tracking-tighter">
                                                            +${Number(bill.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    ) : <span className="text-slate-200">—</span>}
                                                </td>
                                                <td className="px-6 py-4 align-middle text-center border-r border-slate-200">
                                                    <Badge className={cn(
                                                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 transition-all",
                                                        bill.status === "PAID"
                                                            ? "bg-emerald-500 text-white border-emerald-600"
                                                            : isOverdue
                                                                ? "bg-red-600 text-white border-red-700 animate-pulse"
                                                                : "bg-orange-500 text-white border-orange-600"
                                                    )}>
                                                        {bill.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-right">
                                                    <Button
                                                        onClick={() => handleToggle(bill.id, bill.status)}
                                                        size="sm"
                                                        variant={bill.status === "PAID" ? "ghost" : "default"}
                                                        className={cn(
                                                            "rounded-lg font-black uppercase italic tracking-widest transition-all h-8 px-4 text-[10px]",
                                                            bill.status === "PAID"
                                                                ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                                : "bg-slate-900 hover:bg-black text-white shadow-lg active:scale-95"
                                                        )}
                                                    >
                                                        {bill.status === "PAID" ? "REVOKE" : "APPROVE"}
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        )
                                    })}
                                </AnimatePresence>
                                {filteredBills.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center bg-slate-50/50">
                                            <div className="flex flex-col items-center gap-4 opacity-20">
                                                <Receipt className="w-16 h-16 text-slate-900" />
                                                <p className="text-xl font-black uppercase italic tracking-tighter">Query Empty</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}
