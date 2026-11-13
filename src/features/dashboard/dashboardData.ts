import {
  countActiveEmployees,
  countDeparturesInPeriod,
  countEarlyDeparturesInPeriod,
  countHiresInPeriod,
  getDepartureReasonDistribution,
  getDepartmentDepartureDistribution,
  getEarlyDepartureRate,
  getEarlyDepartureShareOfHires,
  getMonthlyHiringDepartureTrend,
} from '../analytics/metrics'
import type { AppData, AutomationSignal } from '../../types/dataModel'
import type { DepartmentDepartureDistribution } from '../analytics/metrics'
import { demoHirePeriod } from '../../data/seed'

export type DashboardKpi = {
  label: string
  value: string
  description: string
  icon: 'users' | 'user-plus' | 'user-minus' | 'clock' | 'percent' | 'briefcase'
}

export type DashboardSignal = {
  id: string
  kind: 'early-departure' | 'overdue-task'
  title: string
  department: string
  reason: string
  detectedAt: string
  status: string
  statusClass: string
}

export type DashboardData = {
  periodLabel: string
  kpis: DashboardKpi[]
  monthlyTrend: ReturnType<typeof getMonthlyHiringDepartureTrend>
  departmentDepartures: ReturnType<typeof getDepartmentDepartureDistribution>
  departureReasons: ReturnType<typeof getDepartureReasonDistribution>
  earlyDepartureByDepartment: DepartmentDepartureDistribution[]
  signals: DashboardSignal[]
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value)
}

function formatPercentage(value: number | null): string {
  if (value === null) {
    return '—'
  }

  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(value)}%`
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function getSignalPresentation(signal: AutomationSignal, data: AppData): DashboardSignal {
  const department = data.departments.find((item) => item.id === signal.departmentId)
  const onboardingTask = data.onboardingTasks.find((item) => item.id === signal.onboardingTaskId)
  const employee = onboardingTask
    ? data.employees.find((item) => item.id === onboardingTask.employeeId)
    : undefined
  const taskDepartment = employee
    ? data.departments.find((item) => item.id === employee.departmentId)
    : undefined
  const status = {
    New: { label: 'Новый', className: 'bg-amber-50 text-amber-700 ring-amber-600/10' },
    'In Progress': {
      label: 'В работе',
      className: 'bg-indigo-50 text-indigo-700 ring-indigo-600/10',
    },
    Resolved: { label: 'Решён', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' },
  }[signal.status]

  if (signal.ruleId === 'early-departure-alert') {
    const distribution = getDepartmentDepartureDistribution(data, demoHirePeriod).find(
      (item) => item.departmentId === signal.departmentId,
    )

    return {
      id: signal.id,
      kind: 'early-departure',
      title: 'Повышенная доля ранних увольнений',
      department: department?.name ?? 'Подразделение не указано',
      reason: distribution
        ? `${distribution.earlyDepartures} из ${distribution.departures} увольнений — до 90 дней работы`
        : 'Доля ранних увольнений выше порога',
      detectedAt: formatDate(signal.detectedAt),
      status: status.label,
      statusClass: status.className,
    }
  }

  return {
    id: signal.id,
    kind: 'overdue-task',
    title: 'Просрочена задача адаптации',
    department: taskDepartment?.name ?? 'Подразделение не указано',
    reason: onboardingTask?.title ?? 'Незавершённая обязательная задача',
    detectedAt: formatDate(signal.detectedAt),
    status: status.label,
    statusClass: status.className,
  }
}

export function getDashboardData(data: AppData): DashboardData {
  const activeEmployees = countActiveEmployees(data)
  const hires = countHiresInPeriod(data, demoHirePeriod)
  const departures = countDeparturesInPeriod(data, demoHirePeriod)
  const earlyDepartures = countEarlyDeparturesInPeriod(data, demoHirePeriod)
  const earlyDepartureRate = getEarlyDepartureRate(data, demoHirePeriod)
  const earlyDepartureShareOfHires = getEarlyDepartureShareOfHires(data, demoHirePeriod)

  return {
    periodLabel: 'За последние 12 месяцев',
    kpis: [
      {
        label: 'Активные сотрудники',
        value: formatCount(activeEmployees),
        description: 'Сейчас в компании',
        icon: 'users',
      },
      {
        label: 'Принято сотрудников',
        value: formatCount(hires),
        description: 'За последние 12 месяцев',
        icon: 'user-plus',
      },
      {
        label: 'Уволено сотрудников',
        value: formatCount(departures),
        description: 'За последние 12 месяцев',
        icon: 'user-minus',
      },
      {
        label: 'Ранние увольнения',
        value: formatCount(earlyDepartures),
        description: 'До 90 дней работы',
        icon: 'clock',
      },
      {
        label: 'Доля ранних увольнений среди уволившихся',
        value: formatPercentage(earlyDepartureRate),
        description: 'Ранние увольнения / все увольнения',
        icon: 'percent',
      },
      {
        label: 'Среди принятых',
        value: formatPercentage(earlyDepartureShareOfHires),
        description: 'Ранние увольнения / все принятые',
        icon: 'briefcase',
      },
    ],
    monthlyTrend: getMonthlyHiringDepartureTrend(data, demoHirePeriod),
    departmentDepartures: getDepartmentDepartureDistribution(data, demoHirePeriod),
    departureReasons: getDepartureReasonDistribution(data, demoHirePeriod),
    earlyDepartureByDepartment: getDepartmentDepartureDistribution(data, demoHirePeriod),
    signals: data.automationSignals
      .map((signal) => getSignalPresentation(signal, data))
      .sort((left, right) => right.detectedAt.localeCompare(left.detectedAt))
      .slice(0, 4),
  }
}
