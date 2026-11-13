import {
  countDeparturesInPeriod,
  countEarlyDeparturesInPeriod,
  countHiresInPeriod,
  getDepartureReasonDistribution,
  getDepartmentDepartureDistribution,
  getEarlyDepartureRate,
  getEarlyDepartureShareOfHires,
} from './metrics'
import type { AppData, DatePeriod, ISODate } from '../../types/dataModel'
import type { DepartmentDepartureDistribution, DepartureReasonDistribution } from './metrics'

export type AnalyticsPeriod = '30-days' | '90-days' | '12-months'

export type AnalyticsKpi = {
  label: string
  value: string
  description: string
}

export type AnalyticsData = {
  period: DatePeriod
  periodLabel: string
  kpis: AnalyticsKpi[]
  departmentDistribution: DepartmentDepartureDistribution[]
  reasonDistribution: DepartureReasonDistribution[]
}

function toISODate(date: Date): ISODate {
  return date.toISOString().slice(0, 10)
}

function getPeriodRange(period: AnalyticsPeriod, asOfDate: ISODate): DatePeriod {
  const endDate = new Date(`${asOfDate}T00:00:00Z`)
  const startDate = new Date(endDate)
  const days = period === '30-days' ? 29 : period === '90-days' ? 89 : undefined

  if (days !== undefined) {
    startDate.setUTCDate(startDate.getUTCDate() - days)
  } else {
    startDate.setUTCFullYear(startDate.getUTCFullYear() - 1)
  }

  return { startDate: toISODate(startDate), endDate: asOfDate }
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

export function getAnalyticsData(
  data: AppData,
  selectedPeriod: AnalyticsPeriod,
  asOfDate: ISODate,
): AnalyticsData {
  const period = getPeriodRange(selectedPeriod, asOfDate)
  const hires = countHiresInPeriod(data, period)
  const departures = countDeparturesInPeriod(data, period)
  const earlyDepartures = countEarlyDeparturesInPeriod(data, period)
  const earlyDepartureRate = getEarlyDepartureRate(data, period)
  const earlyDepartureShareOfHires = getEarlyDepartureShareOfHires(data, period)
  const periodLabels: Record<AnalyticsPeriod, string> = {
    '30-days': 'Последние 30 дней',
    '90-days': 'Последние 90 дней',
    '12-months': 'Последние 12 месяцев',
  }

  return {
    period,
    periodLabel: periodLabels[selectedPeriod],
    kpis: [
      {
        label: 'Наймы',
        value: formatCount(hires),
        description: 'Количество принятых сотрудников',
      },
      {
        label: 'Увольнения',
        value: formatCount(departures),
        description: 'Количество увольнений за период',
      },
      {
        label: 'Ранние увольнения',
        value: formatCount(earlyDepartures),
        description: 'Увольнения до 90 дней работы',
      },
      {
        label: 'Доля ранних среди уволившихся',
        value: formatPercentage(earlyDepartureRate),
        description: 'Ранние увольнения / все увольнения',
      },
      {
        label: 'Доля ранних среди принятых',
        value: formatPercentage(earlyDepartureShareOfHires),
        description: 'Ранние увольнения / все наймы',
      },
    ],
    departmentDistribution: getDepartmentDepartureDistribution(data, period),
    reasonDistribution: getDepartureReasonDistribution(data, period),
  }
}
