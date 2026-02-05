'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Building2, Hash, DollarSign, Send, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { createBill } from "@/actions/bill"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    companyId: z.string().min(1, "Please select a company"),
    date: z.any().refine((val) => val instanceof Date && !isNaN(val.getTime()), "A valid date is required."),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
})

type FormValues = {
    companyId: string
    date: Date
    invoiceNumber: string
    amount: number
}

interface Company {
    id: string
    name: string
}

interface BillFormProps {
    companies: Company[]
}

export function BillForm({ companies }: BillFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyId: "",
            date: new Date(),
            invoiceNumber: "",
            amount: 0,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        const result = await createBill(values)
        if (result.success) {
            form.reset()
            router.push(`/companies/${values.companyId}`)
        } else {
            console.error(result.error)
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <FormField<FormValues, "companyId">
                        control={form.control}
                        name="companyId"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-slate-900 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-emerald-600" />
                                    Target Company
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium transition-all">
                                            <SelectValue placeholder="Identify the client..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                        {companies.map((company) => (
                                            <SelectItem key={company.id} value={company.id} className="rounded-xl py-3 focus:bg-emerald-50 focus:text-emerald-700">
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="font-bold" />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <FormField<FormValues, "date">
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-3">
                                    <FormLabel className="text-slate-900 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-emerald-600" />
                                        Issuance Date
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-14 rounded-2xl border-slate-200 bg-slate-50/50 text-left font-medium text-lg hover:border-emerald-400 transition-all",
                                                        !field.value && "text-slate-400"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "MMMM do, yyyy")
                                                    ) : (
                                                        <span>Select record date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-5 w-5 text-slate-400" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-slate-100" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage className="font-bold" />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <FormField<FormValues, "invoiceNumber">
                            control={form.control}
                            name="invoiceNumber"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-slate-900 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-emerald-600" />
                                        Invoice Reference
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="eg. INV-2024-001"
                                            className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-medium transition-all"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="font-bold" />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <FormField<FormValues, "amount">
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-slate-900 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                    Total Amount
                                </FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-2xl group-focus-within:text-emerald-600 transition-colors">$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="pl-12 h-20 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 text-4xl font-black transition-all"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="font-bold" />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="pt-4"
                >
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-black text-white text-xl font-black transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-6 h-6" />
                                Finalize Record
                            </>
                        )}
                    </Button>
                </motion.div>
            </form>
        </Form>
    )
}
