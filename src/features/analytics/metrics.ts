import type { AppData, DatePeriod, ISODate } from '../../types/dataModel'

export type DepartmentDepartureDistribution = {
  departmentId: string
  departmentName: string
  departures: number
  earlyDepartures: number
}

export type DepartureReasonDistribution = {
  reason: string
  departures: number
}

function isWithinPeriod(date: ISODate, period: DatePeriod): boolean {
  return date >= period.startDate && date <= period.endDate
}

function daysBetween(startDate: ISODate, endDate: ISODate): number {
  const start = Date.parse(`${startDate}T00:00:00Z`)
  const end = Date.parse(`${endDate}T00:00:00Z`)

  return Math.floor((end - start) / 86_400_000)
}

function getEmployeeById(data: AppData, employeeId: string) {
  return data.employees.find((employee) => employee.id === employeeId)
}

function isEarlyDeparture(data: AppData, employeeId: string, departureDate: ISODate): boolean {
  const employee = getEmployeeById(data, employeeId)

  return employee !== undefined && daysBetween(employee.hireDate, departureDate) < 90
}

export function countActiveEmployees(data: AppData): number {
  return data.employees.filter((employee) => employee.status === 'Active').length
}

export function countHiresInPeriod(data: AppData, period: DatePeriod): number {
  return data.employees.filter((employee) => isWithinPeriod(employee.hireDate, period)).length
}

export function countDeparturesInPeriod(data: AppData, period: DatePeriod): number {
  return data.departures.filter((departure) => isWithinPeriod(departure.date, period)).length
}

export function countEarlyDeparturesInPeriod(data: AppData, period: DatePeriod): number {
  return data.departures.filter(
    (departure) =>
      isWithinPeriod(departure.date, period) &&
      isEarlyDeparture(data, departure.employeeId, departure.date),
  ).length
}

export function getEarlyDepartureRate(data: AppData, period: DatePeriod): number | null {
  const departures = countDeparturesInPeriod(data, period)

  if (departures === 0) {
    return null
  }

  return (countEarlyDeparturesInPeriod(data, period) / departures) * 100
}

export function getEarlyDepartureShareOfHires(
  data: AppData,
  hirePeriod: DatePeriod,
): number | null {
  const hires = data.employees.filter((employee) => isWithinPeriod(employee.hireDate, hirePeriod))

  if (hires.length === 0) {
    return null
  }

  const cohortEmployeeIds = new Set(hires.map((employee) => employee.id))
  const earlyDepartures = data.departures.filter(
    (departure) =>
      cohortEmployeeIds.has(departure.employeeId) &&
      isEarlyDeparture(data, departure.employeeId, departure.date),
  ).length

  return (earlyDepartures / hires.length) * 100
}

export function getDepartmentDepartureDistribution(
  data: AppData,
  period: DatePeriod,
): DepartmentDepartureDistribution[] {
  return data.departments.map((department) => {
    const departmentDepartures = data.departures.filter((departure) => {
      const employee = getEmployeeById(data, departure.employeeId)

      return employee?.departmentId === department.id && isWithinPeriod(departure.date, period)
    })

    return {
      departmentId: department.id,
      departmentName: department.name,
      departures: departmentDepartures.length,
      earlyDepartures: departmentDepartures.filter((departure) =>
        isEarlyDeparture(data, departure.employeeId, departure.date),
      ).length,
    }
  })
}

export function getDepartureReasonDistribution(
  data: AppData,
  period: DatePeriod,
): DepartureReasonDistribution[] {
  const counts = new Map<string, number>()

  for (const departure of data.departures) {
    if (!isWithinPeriod(departure.date, period)) {
      continue
    }

    counts.set(departure.reason, (counts.get(departure.reason) ?? 0) + 1)
  }

  return Array.from(counts, ([reason, departures]) => ({ reason, departures }))
}
