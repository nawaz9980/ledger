import { getCompany } from "@/actions/company"
import { notFound } from "next/navigation"
import { CompanyLedgerClient } from "@/components/company-ledger-client"
import { getSession } from "@/lib/auth"

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const [companyResult, session] = await Promise.all([
        getCompany(resolvedParams.id),
        getSession()
    ]);

    if (!companyResult.success || !companyResult.data) {
        notFound()
    }

    return <CompanyLedgerClient company={companyResult.data} session={session} />
}
