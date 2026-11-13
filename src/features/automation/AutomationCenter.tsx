import { Activity, AlertCircle, CheckCircle2, CircleDot, Filter, ListChecks } from 'lucide-react'
import { useMemo, useState } from 'react'
import type {
  AppData,
  AutomationRuleId,
  AutomationSignalStatus,
  InternalTaskStatus,
} from '../../types/dataModel'
import { filterAutomationSignals, getAutomationSignalViews, getAutomationSummary } from './automationData'
import type { SignalStatusFilter, SignalTypeFilter } from './automationData'
import { SignalDetails } from './SignalDetails'

type AutomationCenterProps = {
  data: AppData
  onSignalStatusChange: (signalId: string, status: AutomationSignalStatus) => void
  onTaskStatusChange: (taskId: string, status: InternalTaskStatus) => void
}

const statusClasses: Record<AutomationSignalStatus, string> = {
  New: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  'In Progress': 'bg-indigo-50 text-indigo-700 ring-indigo-600/10',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
}

const statusLabels: Record<AutomationSignalStatus, string> = {
  New: 'Новый',
  'In Progress': 'В работе',
  Resolved: 'Обработан',
}

const ruleLabels: Record<AutomationRuleId, string> = {
  'early-departure-alert': 'Ранние увольнения',
  'overdue-onboarding-task': 'Просроченная задача адаптации',
}

function SummaryCard({ label, value, icon: Icon, tone }: {
  label: string
  value: number
  icon: typeof Activity
  tone: string
}) {
  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30">
      <div className={`mb-4 flex size-9 items-center justify-center rounded-lg ${tone}`}><Icon size={17} /></div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </article>
  )
}

export function AutomationCenter({ data, onSignalStatusChange, onTaskStatusChange }: AutomationCenterProps) {
  const [statusFilter, setStatusFilter] = useState<SignalStatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState<SignalTypeFilter>('all')
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null)
  const signalViews = useMemo(() => getAutomationSignalViews(data), [data])
  const filteredSignals = useMemo(
    () => filterAutomationSignals(signalViews, statusFilter, typeFilter),
    [signalViews, statusFilter, typeFilter],
  )
  const selectedSignal = signalViews.find(({ signal }) => signal.id === selectedSignalId)
  const summary = getAutomationSummary(data)

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard label="Всего сигналов" value={summary.total} icon={Activity} tone="bg-indigo-50 text-indigo-600" />
        <SummaryCard label="Новые" value={summary.new} icon={CircleDot} tone="bg-amber-50 text-amber-600" />
        <SummaryCard label="В работе" value={summary.inProgress} icon={AlertCircle} tone="bg-sky-50 text-sky-600" />
        <SummaryCard label="Обработаны" value={summary.resolved} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600" />
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Сигналы и задачи</h2>
            <p className="mt-1 text-xs text-slate-400">Просматривайте проблемы адаптации и отслеживайте их обработку.</p>
          </div>
          <div className="flex flex-col gap-2 xs:flex-row">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
              <Filter size={14} className="shrink-0 text-slate-400" />
              <span className="sr-only">Фильтр по статусу</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as SignalStatusFilter)} className="min-w-28 bg-transparent text-xs text-slate-700 outline-none">
                <option value="all">Все статусы</option>
                <option value="New">Новые</option>
                <option value="In Progress">В работе</option>
                <option value="Resolved">Обработаны</option>
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
              <ListChecks size={14} className="shrink-0 text-slate-400" />
              <span className="sr-only">Фильтр по типу сигнала</span>
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as SignalTypeFilter)} className="min-w-36 bg-transparent text-xs text-slate-700 outline-none">
                <option value="all">Все типы сигналов</option>
                <option value="early-departure-alert">Ранние увольнения</option>
                <option value="overdue-onboarding-task">Просроченная задача</option>
              </select>
            </label>
          </div>
        </div>

        {filteredSignals.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-slate-600">Сигналы не найдены</p>
            <p className="mt-1 text-xs text-slate-400">Измените фильтры, чтобы увидеть другие сигналы.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredSignals.map((item) => (
              <li key={item.signal.id}>
                <button type="button" onClick={() => setSelectedSignalId(item.signal.id)} className="grid w-full gap-3 px-4 py-4 text-left transition hover:bg-slate-50/80 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_auto] sm:items-center sm:px-5">
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-slate-800">{item.ruleName}</span>
                    <span className="mt-1 block text-[11px] text-slate-500">{ruleLabels[item.signal.ruleId]}</span>
                  </span>
                  <span className="min-w-0 text-xs text-slate-600">
                    <span className="block font-medium text-slate-700">{item.departmentName}</span>
                    <span className="mt-1 block truncate text-[11px] text-slate-400">{item.description}</span>
                  </span>
                  <span className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-[11px] text-slate-400">{item.detectedAtLabel}</span>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset ${statusClasses[item.signal.status]}`}>
                      {statusLabels[item.signal.status]}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400 sm:col-span-3">Задача: <span className="text-slate-600">{item.taskLabel}</span> · {item.taskStatusLabel}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-slate-100 px-4 py-3 text-[11px] text-slate-400 sm:px-5">
          Показано {filteredSignals.length} из {data.automationSignals.length} сигналов · Демонстрационные данные
        </div>
      </section>

      {selectedSignal && (
        <SignalDetails
          item={selectedSignal}
          onClose={() => setSelectedSignalId(null)}
          onSignalStatusChange={(status) => onSignalStatusChange(selectedSignal.signal.id, status)}
          onTaskStatusChange={(status) => {
            if (selectedSignal.task) onTaskStatusChange(selectedSignal.task.id, status)
          }}
        />
      )}
    </div>
  )
}
