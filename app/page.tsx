'use client'

import Link from "next/link"
import { ArrowRight, Building2, FilePlus, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12 text-center overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 relative z-10"
      >
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
          Staffs Updates Bill
        </h1>
        <p className="max-w-[700px] text-xl text-muted-foreground mx-auto leading-relaxed">
          The premium ledger system for modern companies. <br className="hidden sm:inline" /> Manage bills, track payments, and stay organized.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 sm:grid-cols-3 w-full max-w-5xl px-4 perspective-1000"
      >
        <motion.div variants={item}>
          <Link href="/companies" className="group block h-full">
            <div className="h-full p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-6">
              <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Companies</h3>
                <p className="text-sm text-slate-500">Manage company profiles and access detailed transaction ledgers.</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link href="/bills/create" className="group block h-full">
            <div className="h-full p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-6">
              <div className="p-4 bg-green-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <FilePlus className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">New Bill</h3>
                <p className="text-sm text-slate-500">Submit a new invoice or record a bill for any registered company.</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link href="/boss" className="group block h-full">
            <div className="h-full p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-6">
              <div className="p-4 bg-purple-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-10 h-10 text-purple-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Boss View</h3>
                <p className="text-sm text-slate-500">Executive dashboard to review all transactions and manage payments.</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pt-8"
      >
        <Link href="/companies">
          <button className="flex items-center gap-3 px-8 py-4 text-lg font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 hover:scale-105 transition-all shadow-lg active:scale-95">
            Get Started Now <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
