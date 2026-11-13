import {
  BriefcaseBusiness,
  Clock3,
  Percent,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react'
import type { DashboardKpi } from './dashboardData'

const iconMap = {
  users: Users,
  'user-plus': UserPlus,
  'user-minus': UserMinus,
  clock: Clock3,
  percent: Percent,
  briefcase: BriefcaseBusiness,
}

const iconStyles = [
  'bg-indigo-50 text-indigo-600',
  'bg-sky-50 text-sky-600',
  'bg-rose-50 text-rose-600',
  'bg-amber-50 text-amber-600',
  'bg-violet-50 text-violet-600',
  'bg-emerald-50 text-emerald-600',
]

type KpiGridProps = {
  items: DashboardKpi[]
}

export function KpiGrid({ items }: KpiGridProps) {
  return (
    <section aria-label="Ключевые показатели" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item, index) => {
        const Icon = iconMap[item.icon]

        return (
          <article key={item.label} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30">
            <div className="flex items-start justify-between gap-3">
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconStyles[index % iconStyles.length]}`}>
                <Icon size={17} strokeWidth={1.8} />
              </div>
              <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500">Демо</span>
            </div>
            <p className="mt-4 text-[12px] font-medium text-slate-500">{item.label}</p>
            <p className="mt-1 text-[25px] font-semibold tracking-tight text-slate-900">{item.value}</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-400">{item.description}</p>
          </article>
        )
      })}
    </section>
  )
}
