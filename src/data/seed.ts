import type { AppData, DatePeriod, Department, Employee, ISODate } from '../types/dataModel'

const departmentSetup = [
  {
    id: 'department-warehouse',
    name: 'Склад',
    activeEmployees: 132,
    recentActiveHires: 32,
    departures: 18,
    earlyDepartures: 9,
    position: 'Сотрудник склада',
  },
  {
    id: 'department-stores',
    name: 'Магазины',
    activeEmployees: 114,
    recentActiveHires: 24,
    departures: 10,
    earlyDepartures: 2,
    position: 'Специалист магазина',
  },
  {
    id: 'department-sales',
    name: 'Продажи',
    activeEmployees: 86,
    recentActiveHires: 16,
    departures: 5,
    earlyDepartures: 1,
    position: 'Менеджер по продажам',
  },
  {
    id: 'department-office',
    name: 'Офис',
    activeEmployees: 68,
    recentActiveHires: 12,
    departures: 3,
    earlyDepartures: 0,
    position: 'Специалист офиса',
  },
] as const

const departureReasons = [
  'Несоответствие ожиданиям',
  'Личные обстоятельства',
  'Условия работы',
  'Другое',
]

function toISODate(date: Date): ISODate {
  return date.toISOString().slice(0, 10)
}

function addDays(date: ISODate, amount: number): ISODate {
  const result = new Date(`${date}T00:00:00Z`)
  result.setUTCDate(result.getUTCDate() + amount)
  return toISODate(result)
}

function subtractOneYear(date: ISODate): ISODate {
  const result = new Date(`${date}T00:00:00Z`)
  result.setUTCFullYear(result.getUTCFullYear() - 1)
  return toISODate(result)
}

function createEmployee(
  id: string,
  departmentId: string,
  position: string,
  hireDate: ISODate,
  status: Employee['status'],
  mentorEmployeeId: string | null,
): Employee {
  return {
    id,
    displayName: `Сотрудник ${id.slice(-4)}`,
    departmentId,
    position,
    hireDate,
    mentorEmployeeId,
    status,
  }
}

export function createSeedData(asOfDate: ISODate = toISODate(new Date())): AppData {
  const departments: Department[] = departmentSetup.map(({ id, name }) => ({ id, name }))
  const employees: Employee[] = []
  const departures: AppData['departures'] = []
  const onboardingTasks: AppData['onboardingTasks'] = []
  const mentorByDepartment = new Map<string, string>()
  let employeeSequence = 0
  let departureSequence = 0
  let reasonSequence = 0

  const nextEmployeeId = () => `employee-${String(++employeeSequence).padStart(4, '0')}`

  for (const department of departmentSetup) {
    const existingActiveEmployees = department.activeEmployees - department.recentActiveHires

    for (let index = 0; index < existingActiveEmployees; index += 1) {
      const id = nextEmployeeId()
      employees.push(
        createEmployee(
          id,
          department.id,
          department.position,
          addDays(asOfDate, -(400 + (index % 500))),
          'Active',
          null,
        ),
      )
      mentorByDepartment.set(department.id, mentorByDepartment.get(department.id) ?? id)
    }
  }

  for (const department of departmentSetup) {
    for (let index = 0; index < department.recentActiveHires; index += 1) {
      const id = nextEmployeeId()
      const hireDate = addDays(asOfDate, -(100 + ((employeeSequence + index) % 261)))
      employees.push(
        createEmployee(
          id,
          department.id,
          department.position,
          hireDate,
          'Active',
          mentorByDepartment.get(department.id) ?? null,
        ),
      )

      const overdue = index < 6
      onboardingTasks.push({
        id: `onboarding-task-${String(onboardingTasks.length + 1).padStart(4, '0')}`,
        employeeId: id,
        title: 'Вводный инструктаж',
        description: 'Знакомство с процессами и правилами работы.',
        assigneeLabel: 'Руководитель отдела',
        dueDate: overdue ? addDays(asOfDate, -(index + 1)) : addDays(hireDate, 14),
        status: overdue ? (index % 2 === 0 ? 'Open' : 'In Progress') : 'Done',
        isMandatory: true,
      })
    }
  }

  for (const department of departmentSetup) {
    for (let index = 0; index < department.departures; index += 1) {
      const isEarly = index < department.earlyDepartures
      const tenureDays = isEarly
        ? 20 + ((departureSequence * 7) % 65)
        : 100 + ((departureSequence * 11) % 51)
      const daysBeforeDeparture = 180 + ((departureSequence * 7) % 30)
      const departureDate = addDays(asOfDate, -daysBeforeDeparture)
      const hireDate = addDays(departureDate, -tenureDays)
      const employeeId = nextEmployeeId()

      employees.push(
        createEmployee(
          employeeId,
          department.id,
          department.position,
          hireDate,
          'Departed',
          mentorByDepartment.get(department.id) ?? null,
        ),
      )
      departures.push({
        id: `departure-${String(++departureSequence).padStart(4, '0')}`,
        employeeId,
        date: departureDate,
        reason: departureReasons[reasonSequence % departureReasons.length],
      })
      reasonSequence += 1
    }
  }

  return {
    departments,
    employees,
    onboardingTasks,
    departures,
    surveyResponses: [],
    automationSignals: [],
    internalTasks: [],
  }
}

export const seedAsOfDate = toISODate(new Date())

export const demoHirePeriod: DatePeriod = {
  startDate: subtractOneYear(seedAsOfDate),
  endDate: seedAsOfDate,
}

export const seedData = createSeedData(seedAsOfDate)
