import { getCompanies } from "@/actions/company"
import { CompanyDialog } from "@/components/company-dialog"
import { CompaniesClient } from "@/components/companies-client"
import * as motion from "framer-motion/client"

export default async function CompaniesPage() {
    const { data: companies, success } = await getCompanies()

    if (!success) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-red-500 font-bold uppercase tracking-widest">Unauthorized Access or System Failure</p>
            </div>
        )
    }

    return (
        <div className="relative">
            <div className="absolute top-0 right-0 p-8 z-10">
                <CompanyDialog />
            </div>
            <CompaniesClient initialCompanies={companies || []} />
        </div>
    )
}
