import { getAllBills } from "@/actions/bill"
import { AlertTriangle } from "lucide-react"
import { BossDashboardClient } from "@/components/boss-dashboard-client"

export default async function BossPage() {
    const { data: bills, success } = await getAllBills()

    if (!success) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold">Failed to load data</h2>
                    <p className="text-muted-foreground">Please check your connection and try again.</p>
                </div>
            </div>
        )
    }

    return <BossDashboardClient initialBills={bills || []} />
}
