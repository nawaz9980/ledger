import { getCompanies } from "@/actions/company"
import { BillForm } from "@/components/bill-form"
import * as motion from "framer-motion/client"

export default async function CreateBillPage() {
    const { data: companies } = await getCompanies()

    return (
        <div className="max-w-3xl mx-auto space-y-12 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-4"
            >
                <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">
                    Entry <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Bill</span>
                </h1>
                <p className="text-slate-500 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                    Precisely record new financial records into the secure ledger system.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-white border border-slate-100 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50">
                    <BillForm companies={companies || []} />
                </div>
            </motion.div>
        </div>
    )
}
