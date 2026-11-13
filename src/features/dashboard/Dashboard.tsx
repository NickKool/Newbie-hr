import { ArrowDownRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import { seedData } from '../../data/seed'
import { DashboardCharts } from './DashboardCharts'
import { getDashboardData } from './dashboardData'
import { KpiGrid } from './KpiGrid'
import { RecentSignals } from './RecentSignals'

const dashboardData = getDashboardData(seedData)

export function Dashboard() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays size={15} className="text-slate-400" />
          <span>{dashboardData.periodLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1"><ArrowUpRight size={13} className="text-emerald-600" /> Демонстрационные данные</span>
          <span className="hidden text-slate-300 sm:inline">|</span>
          <span className="hidden items-center gap-1 sm:inline-flex"><ArrowDownRight size={13} /> Только синтетические сведения</span>
        </div>
      </div>

      <KpiGrid items={dashboardData.kpis} />
      <DashboardCharts
        monthlyTrend={dashboardData.monthlyTrend}
        departmentDepartures={dashboardData.departmentDepartures}
        departureReasons={dashboardData.departureReasons}
        earlyDepartureByDepartment={dashboardData.earlyDepartureByDepartment}
      />
      <RecentSignals signals={dashboardData.signals} />
    </div>
  )
}
