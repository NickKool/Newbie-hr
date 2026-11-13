import { ArrowUpRight, CircleAlert, Clock3 } from 'lucide-react'
import type { DashboardSignal } from './dashboardData'

type RecentSignalsProps = {
  signals: DashboardSignal[]
}

export function RecentSignals({ signals }: RecentSignalsProps) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Последние сигналы</h2>
          <p className="mt-1 text-xs text-slate-400">Требуют внимания HR или руководителя</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 transition hover:text-indigo-800">
          Все сигналы <ArrowUpRight size={14} />
        </button>
      </div>
      {signals.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-400">Новых сигналов нет</div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {signals.map((signal) => (
            <li key={signal.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex min-w-0 items-start gap-3">
                <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${signal.kind === 'overdue-task' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                  {signal.kind === 'overdue-task' ? <Clock3 size={16} /> : <CircleAlert size={16} />}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{signal.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{signal.department} <span className="mx-1 text-slate-300">·</span> {signal.reason}</p>
                  <p className="mt-1 text-[11px] text-slate-400">Обнаружен: {signal.detectedAt}</p>
                </div>
              </div>
              <span className={`ml-11 inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset sm:ml-0 ${signal.statusClass}`}>
                {signal.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
