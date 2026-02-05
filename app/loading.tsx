'use client'

import { motion } from "framer-motion"
import Image from "next/image"

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                    scale: [0.8, 1.1, 1],
                    opacity: 1,
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="relative w-32 h-32 md:w-48 md:h-48"
            >
                <Image
                    src="/logo.jpg"
                    alt="Loading..."
                    fill
                    className="object-contain"
                    priority
                />
            </motion.div>
        </div>
    )
}
