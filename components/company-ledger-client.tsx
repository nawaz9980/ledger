"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Clock, Receipt, Calendar, CreditCard, ExternalLink, Plus, Minus, AlertCircle, PlusCircle, ArrowDownCircle, ArrowUpCircle, Download } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"
import { createBill } from "@/actions/bill"
import { useRouter } from "next/navigation"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CompanyLedgerClientProps {
    company: any
    session: any
}

export function CompanyLedgerClient({ company, session }: CompanyLedgerClientProps) {
    const bills = company.bills || []
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)

    // Financial Year logic: April 1 to March 31
    const getFinancialYear = (date: Date) => {
        const d = new Date(date)
        const month = d.getMonth()
        const year = d.getFullYear()
        if (month < 3) { // Jan, Feb, Mar
            return `${year - 1}-${year.toString().slice(-2)}`
        }
        return `${year}-${(year + 1).toString().slice(-2)}`
    }

    const availableYears = Array.from(new Set(bills.map((b: any) => getFinancialYear(new Date(b.date))))) as string[]
    availableYears.sort().reverse()
    const [selectedYear, setSelectedYear] = useState<string>("ALL")

    const filteredBills = selectedYear === "ALL"
        ? bills
        : bills.filter((b: any) => getFinancialYear(new Date(b.date)) === selectedYear)

    // Calculate stats based on filtered transactions
    const totalBilled = filteredBills
        .filter((b: any) => b.type === 'DEBIT' || !b.type)
        .reduce((acc: number, b: any) => acc + Number(b.amount), 0)

    const totalPaid = filteredBills
        .filter((b: any) => b.type === 'CREDIT' || b.status === 'PAID')
        .reduce((acc: number, b: any) => {
            return b.type === 'CREDIT' ? acc + Number(b.amount) : acc
        }, 0)

    const balance = totalBilled - totalPaid
    const isAdmin = session?.user?.role === 'admin'

    const stats = [
        {
            title: "Total Billed",
            value: totalBilled,
            icon: ArrowUpCircle,
            color: "blue",
            sub: "Aggregate Invoices"
        },
        {
            title: "Total Paid",
            value: totalPaid,
            icon: ArrowDownCircle,
            color: "green",
            sub: "Account Credits"
        },
        {
            title: "Net Balance",
            value: Math.abs(balance),
            icon: CreditCard,
            color: balance > 0 ? "amber" : "emerald",
            sub: balance > 0 ? "Amount Due" : "Credit Balance"
        }
    ]

    const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const amount = parseFloat(formData.get("amount") as string)
        const type = formData.get("type") as 'DEBIT' | 'CREDIT'
        const invoiceNumber = formData.get("reference") as string
        const date = new Date(formData.get("date") as string)

        startTransition(async () => {
            const res = await createBill({
                companyId: company.id,
                amount,
                type,
                invoiceNumber,
                date
            })

            if (res.success) {
                setOpen(false)
                router.refresh()
            }
        })
    }

    const generatePDF = () => {
        const doc = new jsPDF()
        const now = new Date().toLocaleString()

        // Styles
        const primaryColor = [15, 23, 42] // Slate-900

        // Header
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(company.name.toUpperCase(), 14, 22)

        doc.setFontSize(10)
        doc.setFont("helvetica", "black")
        doc.setTextColor(100, 116, 139) // Slate-500
        const periodText = selectedYear === "ALL" ? "COMPLETE HISTORY" : `PERIOD: FY ${selectedYear}`
        doc.text(`OFFICIAL MASTER TRANSACTION LEDGER | ${periodText}`, 14, 28)
        doc.text(`GENERATED: ${now}`, 14, 33)

        // Summary Box
        doc.setDrawColor(226, 232, 240) // Slate-200
        doc.setFillColor(248, 250, 252) // Slate-50
        doc.roundedRect(14, 40, 182, 30, 3, 3, 'F')

        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(100, 116, 139)
        doc.text("TOTAL BILLED", 20, 48)
        doc.text("PAYMENTS RECEIVED", 80, 48)
        doc.text("NET BALANCE", 140, 48)

        doc.setFontSize(16)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(`$${totalBilled.toLocaleString()}`, 20, 58)
        doc.text(`$${totalPaid.toLocaleString()}`, 80, 58)

        const balanceColor = balance > 0 ? [180, 83, 9] : [5, 150, 105] // Amber or Emerald
        doc.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2])
        doc.text(`${balance > 0 ? "" : "+"}$${Math.abs(balance).toLocaleString()}`, 140, 58)

        // Table
        const tableData = filteredBills.map((bill: any) => [
            new Date(bill.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase(),
            bill.invoice_number,
            (bill.type === 'DEBIT' || !bill.type) ? `-$${Number(bill.amount).toLocaleString()}` : '—',
            bill.type === 'CREDIT' ? `+$${Number(bill.amount).toLocaleString()}` : '—',
            bill.status
        ])

        autoTable(doc, {
            startY: 80,
            head: [['DATE', 'DESCRIPTION / REF', 'DEBIT (-)', 'CREDIT (+)', 'STATUS']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [15, 23, 42] as [number, number, number],
                textColor: [255, 255, 255] as [number, number, number],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 5
            },
            columnStyles: {
                0: { fontStyle: 'bold', fontSize: 9 },
                1: { font: 'courier', fontSize: 9 },
                2: { halign: 'right', textColor: [220, 38, 38] as [number, number, number], fontStyle: 'bold' }, // Red-600
                3: { halign: 'right', textColor: [5, 150, 105] as [number, number, number], fontStyle: 'bold' }, // Emerald-600
                4: { halign: 'center' }
            },
            styles: {
                fontSize: 8,
                cellPadding: 4
            },
            didDrawPage: (data) => {
                doc.setFontSize(8)
                doc.setTextColor(148, 163, 184)
                doc.text(`Page ${data.pageNumber}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10)
            }
        })

        doc.save(`${company.name}_Ledger_${new Date().toISOString().split('T')[0]}.pdf`)
    }

    return (
        <div className="space-y-10 max-w-6xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-6"
            >
                <div className="flex items-center gap-6">
                    <Link href="/companies">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="outline" size="icon" className="group rounded-2xl border-slate-200 h-14 w-14 bg-white shadow-sm hover:border-blue-400">
                                <ArrowLeft className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </Button>
                        </motion.div>
                    </Link>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-black tracking-tight text-slate-900"
                        >
                            {company.name}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 mt-2"
                        >
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg">
                                LEDGER SYSTEM
                            </Badge>
                            <div className="h-1 w-1 rounded-full bg-slate-300 mx-1" />
                            <p className="text-slate-500 font-medium">Financial Overview</p>
                        </motion.div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="h-14 w-[180px] rounded-2xl border-slate-200 bg-white font-black text-slate-900 uppercase tracking-tighter italic">
                            <SelectValue placeholder="Fiscal Year" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                            <SelectItem value="ALL" className="font-black italic">ALL PERIODS</SelectItem>
                            {availableYears.map((fy: string) => (
                                <SelectItem key={fy} value={fy} className="font-black italic uppercase">FY {fy}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={generatePDF}
                        variant="outline"
                        className="h-14 px-8 border-slate-200 text-slate-900 bg-white hover:bg-slate-50 rounded-2xl shadow-sm font-bold text-lg flex items-center gap-3"
                    >
                        <Download className="w-5 h-5" />
                        Export Ledger
                    </Button>
                    {isAdmin && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-14 px-8 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl shadow-xl shadow-blue-600/20 font-bold text-lg flex items-center gap-3">
                                    <PlusCircle className="w-5 h-5" />
                                    Add Entry
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">Manual Ledger Entry</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddTransaction} className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Type</Label>
                                        <Select name="type" defaultValue="CREDIT">
                                            <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                <SelectItem value="DEBIT" className="font-bold">DEBIT (Invoice)</SelectItem>
                                                <SelectItem value="CREDIT" className="font-bold">CREDIT (Payment)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Value</Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-lg"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reference" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Document Reference</Label>
                                        <Input
                                            id="reference"
                                            name="reference"
                                            placeholder="e.g. PAY-882, INV-001"
                                            className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entry Date</Label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="date"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold"
                                            required
                                        />
                                    </div>
                                    <DialogFooter className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-xl italic"
                                        >
                                            {isPending ? "Recording..." : "Finalize Entry"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                    <Link href="/bills/create">
                        <Button variant="outline" className="h-14 px-8 border-slate-200 text-slate-900 bg-white hover:bg-slate-50 rounded-2xl shadow-sm font-bold text-lg flex items-center gap-3">
                            <Receipt className="w-5 h-5" />
                            New Invoice
                        </Button>
                    </Link>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                    >
                        <Card className={cn(
                            "border-none shadow-2xl relative overflow-hidden group",
                            stat.color === "blue" ? "bg-blue-600 text-white" :
                                stat.color === "green" ? "bg-emerald-500 text-white" :
                                    stat.color === "emerald" ? "bg-emerald-500 text-white" : "bg-white ring-1 ring-slate-100"
                        )}>
                            <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                <stat.icon className="w-24 h-24" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                <CardTitle className={cn(
                                    "text-sm font-black uppercase tracking-widest",
                                    (stat.color === "amber") ? "text-amber-600" : "text-white/80"
                                )}>
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={cn(
                                    "h-5 w-5",
                                    (stat.color === "amber") ? "text-amber-500" : "text-white/60"
                                )} />
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className={cn(
                                    "text-4xl font-black mb-1",
                                    (stat.color === "amber") ? "text-slate-900" : "text-white"
                                )}>
                                    ${stat.value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                </div>
                                <p className={cn(
                                    "text-sm font-medium",
                                    (stat.color === "amber") ? "text-slate-400" : "text-white/70"
                                )}>
                                    {stat.sub}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden ring-1 ring-slate-200/60">
                    <CardHeader className="bg-white border-b border-slate-200 px-8 py-5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter italic">
                                <Receipt className="w-6 h-6 text-blue-600" />
                                Master Transaction Ledger
                            </CardTitle>
                            <Badge className="bg-slate-900 text-white rounded-lg px-4 py-1 font-black text-xs border-none shadow-md">
                                {filteredBills.length} TOTAL RECORDS
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto max-h-[700px] overflow-y-auto border-t border-slate-200 scrollbar-hide">
                            <table className="w-full text-left border-collapse min-w-[900px] border-b border-slate-200">
                                <thead className="sticky top-0 z-20">
                                    <tr className="bg-slate-50 border-b-2 border-slate-300">
                                        <th className="px-8 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200">Date</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200">Transaction Type</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200">Reference</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200 text-right">Debit (-)</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-r border-slate-200 text-right">Credit (+)</th>
                                        <th className="px-8 py-5 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {filteredBills.map((bill: any, idx: number) => (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.01 + 0.7 }}
                                            key={bill.id}
                                            className="group even:bg-slate-50/70 hover:bg-blue-50/50 transition-colors"
                                        >
                                            <td className="px-8 py-4 align-middle border-r border-slate-200">
                                                <span className="font-black text-slate-900 text-sm tabular-nums italic">
                                                    {new Date(bill.date).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: '2-digit'
                                                    }).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 align-middle border-r border-slate-200">
                                                <Badge variant="outline" className={cn(
                                                    "px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border-2",
                                                    bill.type === 'DEBIT' || !bill.type
                                                        ? "text-red-600 border-red-100 bg-red-50/50"
                                                        : "text-emerald-600 border-emerald-100 bg-emerald-50/50"
                                                )}>
                                                    {bill.type || 'DEBIT'}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-4 align-middle border-r border-slate-200 font-mono text-sm font-black text-slate-600 group-hover:text-blue-600 lowercase tracking-tighter">
                                                {bill.invoice_number}
                                            </td>
                                            <td className="px-8 py-4 align-middle text-right border-r border-slate-200">
                                                {(bill.type === 'DEBIT' || !bill.type) ? (
                                                    <span className="text-lg font-black text-red-600 tabular-nums tracking-tighter">
                                                        -${Number(bill.amount).toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })}
                                                    </span>
                                                ) : <span className="text-slate-200">—</span>}
                                            </td>
                                            <td className="px-8 py-4 align-middle text-right border-r border-slate-200">
                                                {bill.type === 'CREDIT' ? (
                                                    <span className="text-lg font-black text-emerald-600 tabular-nums tracking-tighter">
                                                        +${Number(bill.amount).toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })}
                                                    </span>
                                                ) : <span className="text-slate-200">—</span>}
                                            </td>
                                            <td className="px-8 py-4 align-middle text-center">
                                                <Badge className={cn(
                                                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 shadow-sm transition-all",
                                                    bill.status === "PAID"
                                                        ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-200"
                                                        : "bg-orange-500 text-white border-orange-600 shadow-orange-200"
                                                )}>
                                                    {bill.status}
                                                </Badge>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {(!filteredBills || filteredBills.length === 0) && (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-32 text-center bg-slate-50/50">
                                                <div className="flex flex-col items-center gap-6 opacity-20">
                                                    <CreditCard className="w-20 h-20 text-slate-900" />
                                                    <div className="space-y-1">
                                                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">No Records</h3>
                                                        <p className="font-bold text-slate-500 text-sm uppercase">Selected fiscal period contains zero entries.</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
