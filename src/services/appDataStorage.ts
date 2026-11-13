import type { AppData } from '../types/dataModel'
import { seedData } from '../data/seed'

const storageKey = 'newbie-hr-app-data'

export function loadAppData(): AppData {
  try {
    const storedValue = window.localStorage.getItem(storageKey)

    if (!storedValue) {
      window.localStorage.setItem(storageKey, JSON.stringify(seedData))
      return seedData
    }

    const parsedValue: unknown = JSON.parse(storedValue)

    if (isAppData(parsedValue)) {
      return parsedValue
    }
  } catch {
    return seedData
  }

  return seedData
}

export function saveAppData(data: AppData): boolean {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

function isAppData(value: unknown): value is AppData {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const data = value as Partial<AppData>

  return (
    Array.isArray(data.departments) &&
    Array.isArray(data.employees) &&
    Array.isArray(data.onboardingTasks) &&
    Array.isArray(data.departures) &&
    Array.isArray(data.surveyResponses) &&
    Array.isArray(data.automationSignals) &&
    Array.isArray(data.internalTasks)
  )
}
