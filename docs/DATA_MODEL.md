# Data Model: Newbie HR

## Scope and Conventions

This document describes the minimal in-browser data model for the MVP. All records are synthetic and exist only for demonstration. Do not use real personal data.

The model is intentionally simple: entities are stored as typed records and related by IDs, without a backend or a complex relational system. Use TypeScript-friendly types, ISO 8601 date strings (`YYYY-MM-DD`) for calendar dates, and stable synthetic IDs. Fields marked **Required** must be present; **Optional** fields may be absent or `null` as indicated.

## Shared Types

```ts
type ISODate = string;
type EntityId = string;

type EmployeeStatus = 'Active' | 'Departed';
type OnboardingTaskStatus = 'Open' | 'In Progress' | 'Done';
type AutomationSignalStatus = 'New' | 'In Progress' | 'Resolved';
type InternalTaskStatus = 'Open' | 'In Progress' | 'Done';
type AutomationRuleId =
  | 'early-departure-alert'
  | 'overdue-onboarding-task';
```

`ISODate` values are calendar dates, not timestamps. Fields identifying a person or department use synthetic IDs and labels only.

## Entities

### Department

| Field | Type | Requirement | Description |
|---|---|---|---|
| `id` | `EntityId` | Required | Stable synthetic department identifier. |
| `name` | `string` | Required | Department display name, such as `Warehouse` or `Stores`. |

### Employee

| Field | Type | Requirement | Description |
|---|---|---|---|
| `id` | `EntityId` | Required | Stable synthetic employee identifier. |
| `displayName` | `string` | Required | Fictional display name or demo label; never real personal data. |
| `departmentId` | `EntityId` | Required | Reference to `Department.id`. |
| `position` | `string` | Required | Synthetic job title. |
| `hireDate` | `ISODate` | Required | Date the employee was hired. |
| `mentorEmployeeId` | `EntityId \| null` | Optional | Reference to another `Employee.id` acting as mentor; `null` when no mentor is assigned. |
| `status` | `EmployeeStatus` | Required | `Active` or `Departed`. |
| `terminationDate` | `ISODate \| null` | Derived | Date from the employee's `Departure` record; not stored independently. `null` when no departure record exists. |

`terminationDate` is a derived view of the related departure date, avoiding duplicate storage. An active employee has no associated departure date. The status and departure record must agree in the in-memory dataset.

### OnboardingTask

| Field | Type | Requirement | Description |
|---|---|---|---|
| `id` | `EntityId` | Required | Stable synthetic task identifier. |
| `employeeId` | `EntityId` | Required | Reference to the employee whose onboarding the task concerns. |
| `title` | `string` | Required | Short task title. |
| `description` | `string \| null` | Optional | Synthetic task details, or `null`. |
| `assigneeLabel` | `string` | Required | Synthetic name or role label for the responsible person; no separate user system is modeled. |
| `dueDate` | `ISODate` | Required | Task due date. |
| `status` | `OnboardingTaskStatus` | Required | `Open`, `In Progress`, or `Done`. |
| `isMandatory` | `boolean` | Required | Whether this is an obligatory onboarding task. |

### Departure

| Field | Type | Requirement | Description |
|---|---|---|---|
| `id` | `EntityId` | Required | Stable synthetic departure identifier. |
| `employeeId` | `EntityId` | Required | Reference to the employee who departed. |
| `date` | `ISODate` | Required | Date of departure; canonical source for `Employee.terminationDate`. |
| `reason` | `string` | Required | Synthetic departure reason used in analytics. |

An employee may have at most one departure record in the MVP dataset. The departure date is not copied into another stored field.

### SurveyResponse

| Field | Type | Requirement | Description |
|---|---|---|---|
| `id` | `EntityId` | Required | Stable synthetic response identifier. |
| `employeeId` | `EntityId` | Required | Reference to the employee; responses are confidential, not anonymous. |
| `submittedAt` | `ISODate` | Required | Date the response was submitted. |
| `answers` | `SurveyAnswer[]` | Required | Answers supplied to the survey. May be empty if no answers were submitted. |

```ts
type SurveyAnswer = {
  questionId: string;
  rating?: number;
  text?: string;
};
```

Questions and answers are synthetic. An optional question may be omitted. The data model does not require a text explanation for a low rating.

### AutomationSignal

| Field | Type | Requirement | Description |
|---|---|---|---|
| `id` | `EntityId` | Required | Stable synthetic signal identifier. |
| `ruleId` | `AutomationRuleId` | Required | Rule that detected the issue. |
| `detectedAt` | `ISODate` | Required | Date the signal was detected. |
| `status` | `AutomationSignalStatus` | Required | `New`, `In Progress`, or `Resolved`. |
| `departmentId` | `EntityId \| null` | Optional | Relevant department for an early-departure signal; otherwise `null`. |
| `onboardingTaskId` | `EntityId \| null` | Optional | Relevant onboarding task for an overdue-task signal; otherwise `null`. |
| `internalTaskId` | `EntityId \| null` | Optional | Reference to the created `InternalTask`, once created. |

The relevant department or onboarding task identifies the problem for deduplication. Only the reference appropriate to the signal's rule needs a value.

### InternalTask

| Field | Type | Requirement | Description |
|---|---|---|---|
| `id` | `EntityId` | Required | Stable synthetic internal task identifier. |
| `signalId` | `EntityId` | Required | Reference to the `AutomationSignal` that created the task. |
| `title` | `string` | Required | Short task title. |
| `assigneeLabel` | `string` | Required | Synthetic name or role label for the responsible HR specialist or manager. |
| `status` | `InternalTaskStatus` | Required | `Open`, `In Progress`, or `Done`. |
| `createdAt` | `ISODate` | Required | Date the task was added to the internal queue. |

The internal task queue is local to the application and simulates HR task creation and tracking; it is not an external integration.

## Relationships

- A `Department` may be referenced by many `Employee` records.
- An `Employee` references one `Department` and may reference one mentor, which is another `Employee`.
- An `Employee` may have multiple `OnboardingTask` records and `SurveyResponse` records.
- A departed `Employee` has one `Departure` record. The departure date on the employee view is derived from that record.
- An `AutomationSignal` references the relevant department or onboarding task and may reference its created `InternalTask`.
- An `InternalTask` references the `AutomationSignal` that created it.

## Application State

The browser state can be represented as simple arrays of these records:

```ts
type AppData = {
  departments: Department[];
  employees: Employee[];
  onboardingTasks: OnboardingTask[];
  departures: Departure[];
  surveyResponses: SurveyResponse[];
  automationSignals: AutomationSignal[];
  internalTasks: InternalTask[];
};
```

The initial `AppData` is loaded from the synthetic seed data. User changes, signals, and internal tasks are persisted in `localStorage` as described in `docs/ARCHITECTURE.md`. Resetting restores the original seed state.

## Data Integrity

- Every ID reference must point to a record in the corresponding collection.
- Employee status must agree with whether a departure record exists.
- A signal's linked entity must correspond to its rule: department for an early-departure alert, onboarding task for an overdue onboarding task.
- Survey responses and all employee-related records use fictional data only.
