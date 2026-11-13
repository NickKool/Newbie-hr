import { Check, Clock3, X } from 'lucide-react'
import type { AutomationSignalStatus, InternalTaskStatus } from '../../types/dataModel'
import type { AutomationSignalView } from './automationData'
import { getSignalStatusLabel, getTaskStatusLabel } from './automationData'

type SignalDetailsProps = {
  item: AutomationSignalView
  onClose: () => void
  onSignalStatusChange: (status: AutomationSignalStatus) => void
  onTaskStatusChange: (status: InternalTaskStatus) => void
}

export function SignalDetails({
  item,
  onClose,
  onSignalStatusChange,
  onTaskStatusChange,
}: SignalDetailsProps) {
  const signalStatusStyles: Record<AutomationSignalStatus, string> = {
    New: 'bg-amber-50 text-amber-700',
    'In Progress': 'bg-indigo-50 text-indigo-700',
    Resolved: 'bg-emerald-50 text-emerald-700',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section role="dialog" aria-modal="true" aria-labelledby="signal-dialog-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-indigo-600">{item.ruleName}</p>
            <h2 id="signal-dialog-title" className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Подробности сигнала</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <dt className="text-[11px] text-slate-400">Подразделение</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{item.departmentName}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <dt className="text-[11px] text-slate-400">Дата обнаружения</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${item.signal.detectedAt}T00:00:00Z`))}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
            <dt className="text-[11px] text-slate-400">Причина срабатывания</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-700">{item.description}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
            <dt className="text-[11px] text-slate-400">Связанная внутренняя задача</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{item.taskLabel}</dd>
            {item.task && <dd className="mt-1 text-xs text-slate-500">Ответственный: {item.task.assigneeLabel}</dd>}
          </div>
        </dl>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-700">Статус сигнала</p>
            <p className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${signalStatusStyles[item.signal.status]}`}>
              {getSignalStatusLabel(item.signal.status)}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.signal.status !== 'In Progress' && item.signal.status !== 'Resolved' && (
                <button type="button" onClick={() => onSignalStatusChange('In Progress')} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                  <Clock3 size={14} /> Взять в работу
                </button>
              )}
              {item.signal.status !== 'Resolved' && (
                <button type="button" onClick={() => onSignalStatusChange('Resolved')} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                  <Check size={14} /> Обработан
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-700">Статус внутренней задачи</p>
            {item.task ? (
              <>
                <p className="mb-3 text-xs text-slate-500">Текущий статус: {getTaskStatusLabel(item.task.status)}</p>
                <select
                  aria-label="Статус внутренней задачи"
                  value={item.task.status}
                  onChange={(event) => onTaskStatusChange(event.target.value as InternalTaskStatus)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="Open">Открыта</option>
                  <option value="In Progress">В работе</option>
                  <option value="Done">Выполнена</option>
                </select>
              </>
            ) : (
              <p className="text-xs text-slate-400">Связанная задача отсутствует.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
