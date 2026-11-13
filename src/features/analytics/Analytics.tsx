import { BarChart3, BriefcaseBusiness, CalendarDays, Clock3, Percent, UserMinus, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { AppData } from '../../types/dataModel'
import { seedAsOfDate } from '../../data/seed'
import { AnalyticsCharts } from './AnalyticsCharts'
import type { AnalyticsPeriod } from './analyticsData'
import { getAnalyticsData } from './analyticsData'

const periodOptions: { value: AnalyticsPeriod; label: string }[] = [
  { value: '30-days', label: '30 дней' },
  { value: '90-days', label: '90 дней' },
  { value: '12-months', label: '12 месяцев' },
]

const kpiIcons = [UserPlus, UserMinus, Clock3, Percent, BriefcaseBusiness]
const kpiColors = [
  'bg-sky-50 text-sky-600',
  'bg-rose-50 text-rose-600',
  'bg-amber-50 text-amber-600',
  'bg-violet-50 text-violet-600',
  'bg-emerald-50 text-emerald-600',
]

type AnalyticsProps = {
  data: AppData
}

export function Analytics({ data }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>('12-months')
  const analytics = useMemo(
    () => getAnalyticsData(data, selectedPeriod, seedAsOfDate),
    [data, selectedPeriod],
  )

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays size={15} className="text-slate-400" />
          <span>Период: {analytics.periodLabel}</span>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm shadow-slate-200/20">
          <BarChart3 size={14} className="text-slate-400" />
          <span>Период</span>
          <select value={selectedPeriod} onChange={(event) => setSelectedPeriod(event.target.value as AnalyticsPeriod)} className="bg-transparent font-medium text-slate-700 outline-none">
            {periodOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </section>

      <section aria-label="Показатели за выбранный период" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {analytics.kpis.map((item, index) => {
          const Icon = kpiIcons[index]

          return (
            <article key={item.label} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30">
              <div className={`flex size-9 items-center justify-center rounded-lg ${kpiColors[index]}`}>
                <Icon size={17} strokeWidth={1.8} />
              </div>
              <p className="mt-4 text-xs font-medium leading-4 text-slate-500">{item.label}</p>
              <p className="mt-1 text-[25px] font-semibold tracking-tight text-slate-900">{item.value}</p>
              <p className="mt-1 text-[11px] leading-4 text-slate-400">{item.description}</p>
            </article>
          )
        })}
      </section>

      <AnalyticsCharts
        departmentDistribution={analytics.departmentDistribution}
        reasonDistribution={analytics.reasonDistribution}
      />

      <p className="text-[11px] text-slate-400">
        Доля среди уволившихся = ранние увольнения ÷ все увольнения. Доля среди принятых = ранние увольнения ÷ все наймы. Данные демонстрационные.
      </p>
    </div>
  )
}
