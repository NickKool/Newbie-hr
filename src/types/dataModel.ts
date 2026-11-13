export type ISODate = string
export type EntityId = string

export type DatePeriod = {
  startDate: ISODate
  endDate: ISODate
}

export type EmployeeStatus = 'Active' | 'Departed'
export type OnboardingTaskStatus = 'Open' | 'In Progress' | 'Done'
export type AutomationSignalStatus = 'New' | 'In Progress' | 'Resolved'
export type InternalTaskStatus = 'Open' | 'In Progress' | 'Done'
export type AutomationRuleId =
  | 'early-departure-alert'
  | 'overdue-onboarding-task'

export type Department = {
  id: EntityId
  name: string
}

export type Employee = {
  id: EntityId
  displayName: string
  departmentId: EntityId
  position: string
  hireDate: ISODate
  mentorEmployeeId: EntityId | null
  status: EmployeeStatus
}

export type OnboardingTask = {
  id: EntityId
  employeeId: EntityId
  title: string
  description: string | null
  assigneeLabel: string
  dueDate: ISODate
  status: OnboardingTaskStatus
  isMandatory: boolean
}

export type Departure = {
  id: EntityId
  employeeId: EntityId
  date: ISODate
  reason: string
}

export type SurveyAnswer = {
  questionId: string
  rating?: number
  text?: string
}

export type SurveyResponse = {
  id: EntityId
  employeeId: EntityId
  submittedAt: ISODate
  answers: SurveyAnswer[]
}

export type AutomationSignal = {
  id: EntityId
  ruleId: AutomationRuleId
  detectedAt: ISODate
  status: AutomationSignalStatus
  departmentId: EntityId | null
  onboardingTaskId: EntityId | null
  internalTaskId: EntityId | null
}

export type InternalTask = {
  id: EntityId
  signalId: EntityId
  title: string
  assigneeLabel: string
  status: InternalTaskStatus
  createdAt: ISODate
}

export type AppData = {
  departments: Department[]
  employees: Employee[]
  onboardingTasks: OnboardingTask[]
  departures: Departure[]
  surveyResponses: SurveyResponse[]
  automationSignals: AutomationSignal[]
  internalTasks: InternalTask[]
}
