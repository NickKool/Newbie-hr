import { getDepartmentDepartureDistribution } from '../analytics/metrics'
import { demoHirePeriod } from '../../data/seed'
import type {
  AppData,
  AutomationRuleId,
  AutomationSignal,
  AutomationSignalStatus,
  InternalTask,
  InternalTaskStatus,
} from '../../types/dataModel'

export type SignalTypeFilter = 'all' | AutomationRuleId
export type SignalStatusFilter = 'all' | AutomationSignalStatus

export type AutomationSignalView = {
  signal: AutomationSignal
  ruleName: string
  departmentName: string
  description: string
  detectedAtLabel: string
  task: InternalTask | undefined
  taskLabel: string
  taskStatusLabel: string
}

const ruleNames: Record<AutomationRuleId, string> = {
  'early-departure-alert': 'Повышенная доля ранних увольнений',
  'overdue-onboarding-task': 'Просроченная задача адаптации',
}

const signalStatusLabels: Record<AutomationSignalStatus, string> = {
  New: 'Новый',
  'In Progress': 'В работе',
  Resolved: 'Обработан',
}

const taskStatusLabels: Record<InternalTaskStatus, string> = {
  Open: 'Открыта',
  'In Progress': 'В работе',
  Done: 'Выполнена',
}

export function getAutomationSummary(data: AppData) {
  return {
    total: data.automationSignals.length,
    new: data.automationSignals.filter((signal) => signal.status === 'New').length,
    inProgress: data.automationSignals.filter((signal) => signal.status === 'In Progress').length,
    resolved: data.automationSignals.filter((signal) => signal.status === 'Resolved').length,
  }
}

export function formatSignalDate(date: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export function getSignalStatusLabel(status: AutomationSignalStatus): string {
  return signalStatusLabels[status]
}

export function getTaskStatusLabel(status: InternalTaskStatus): string {
  return taskStatusLabels[status]
}

export function getAutomationSignalViews(data: AppData): AutomationSignalView[] {
  return data.automationSignals
    .map((signal) => {
      const department = data.departments.find((item) => item.id === signal.departmentId)
      const onboardingTask = data.onboardingTasks.find((item) => item.id === signal.onboardingTaskId)
      const employee = onboardingTask
        ? data.employees.find((item) => item.id === onboardingTask.employeeId)
        : undefined
      const taskDepartment = employee
        ? data.departments.find((item) => item.id === employee.departmentId)
        : undefined
      const task = data.internalTasks.find((item) => item.id === signal.internalTaskId)

      let description: string

      if (signal.ruleId === 'early-departure-alert') {
        const departmentSummary = getDepartmentDepartureDistribution(data, demoHirePeriod).find(
          (item) => item.departmentId === signal.departmentId,
        )

        description = departmentSummary
          ? `${departmentSummary.earlyDepartures} из ${departmentSummary.departures} увольнений в подразделении произошли до 90 дней работы.`
          : 'Доля ранних увольнений в подразделении превысила порог.'
      } else {
        description = onboardingTask
          ? `Обязательная задача «${onboardingTask.title}» просрочена и не завершена.`
          : 'Обязательная задача адаптации просрочена и не завершена.'
      }

      return {
        signal,
        ruleName: ruleNames[signal.ruleId],
        departmentName: department?.name ?? taskDepartment?.name ?? 'Подразделение не указано',
        description,
        detectedAtLabel: formatSignalDate(signal.detectedAt),
        task,
        taskLabel: task?.title ?? 'Внутренняя задача не создана',
        taskStatusLabel: task ? getTaskStatusLabel(task.status) : 'Нет задачи',
      }
    })
    .sort((left, right) => right.signal.detectedAt.localeCompare(left.signal.detectedAt))
}

export function filterAutomationSignals(
  signals: AutomationSignalView[],
  statusFilter: SignalStatusFilter,
  typeFilter: SignalTypeFilter,
): AutomationSignalView[] {
  return signals.filter(
    ({ signal }) =>
      (statusFilter === 'all' || signal.status === statusFilter) &&
      (typeFilter === 'all' || signal.ruleId === typeFilter),
  )
}
