import { Suspense } from "react"

import { KPICards } from "@/components/kpi-cards"
import { SalesChart } from "@/components/sales-chart"
import { RecentProducts } from "@/components/recent-products"
import { RecentSales } from "@/components/recent-sales"
import { PendingDebts } from "@/components/pending-debts"
import { KPICardsSkeleton } from "@/components/skeletons"
import { PageHeader } from "@/components/page-header"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/30 w-full">
      <PageHeader
        title="Overview"
        description="Dashboard overview of your stock management"
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Overview" }]}
      />
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* KPI Cards */}
        <Suspense fallback={<KPICardsSkeleton />}>
          <div className="animate-fade-in">
            <KPICards />
          </div>
        </Suspense>

        {/* Sales Chart */}
        <div className="w-full animate-fade-in-delay-1">
          <SalesChart />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-delay-2">
          {/* Recent Products */}
          <div className="lg:col-span-1">
            <RecentProducts />
          </div>

          {/* Recent Sales */}
          <div className="lg:col-span-1">
            <RecentSales />
          </div>

          {/* Pending Debts */}
          <div className="lg:col-span-1">
            <PendingDebts />
          </div>
        </div>
      </div>
    </div>
  )
}