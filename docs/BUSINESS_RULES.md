# Business Rules: Newbie HR

## Scope

These rules define the MVP HR metrics, synthetic demonstration values, and two deterministic automations. Thresholds and values are demonstration settings, not industry benchmarks. All data is fictional and must not be presented as real TGT statistics.

## Definitions

- **Selected period**: the period chosen for a period-based metric. Exact inclusive/exclusive date boundaries are not specified here and must be consistent wherever the selected period is used.
- **Departure**: an employee termination represented by a `Departure` record and its departure date.
- **Early departure**: a departure that occurs before the employee completes 90 days of employment. A departure on or after the 90-day mark is not early.
- **Completed 90-day observation period**: the employee has reached 90 days from the hire date, so the full observation window has elapsed. Do not include employees whose 90-day observation window is not yet complete when analyzing a 90-day hire cohort.

## HR Metrics

### 1. Active Employees

Count employees whose current status is `Active`.

### 2. Hires During a Selected Period

Count employees whose hire date falls within the selected period.

### 3. Departures During a Selected Period

Count departure records whose departure date falls within the selected period.

### 4. Early Departures

Count departures during the relevant period or cohort where the employee left before completing 90 days of employment.

### 5. Early Departure Rate Among Departures

This measures the share of departures that were early:

```text
Early Departure Rate = (early departures / all departures) × 100%
```

The denominator is all departures in the same analysis scope. This is not the same measure as early departures divided by hires.

### 6. Early Departure Share of Hires

This measures early departures in relation to hires:

```text
Early Departure Share of Hires = (early departures / hires) × 100%
```

Use the same analysis scope for the numerator and hire cohort. Do not label this as the Early Departure Rate or combine the two metrics.

### 90-Day Cohort Analysis

When analyzing a 90-day hire cohort, include only employees whose 90-day observation period has completed. Employees whose observation window is still in progress must not be treated as completed non-early outcomes or included as eligible observations in that cohort analysis.

### Turnover Terminology

Do not call the early departure rate a standard employee turnover rate. A classic turnover rate requires the average employee headcount during the period; this MVP's early-departure metric does not use that denominator.

### Undefined Percentages

Behavior when a percentage denominator is zero is not specified by the product requirements. Do not silently treat an undefined percentage as 0%; confirm the display and calculation behavior before implementation.

## Synthetic Demonstration Data

The demonstration dataset uses these values:

- 400 active employees.
- 120 hires in the last 12 months.
- 36 departures from that hire cohort.
- 12 of those 36 departures occurred before 90 days.

Department breakdown of the 36 departures:

| Department | Departures | Early departures |
|---|---:|---:|
| Warehouse | 18 | 9 |
| Stores | 10 | 2 |
| Sales | 5 | 1 |
| Office | 3 | 0 |
| **Total** | **36** | **12** |

All employees, departments, hires, departures, reasons, and survey responses in this dataset are fictional and intended only for demonstration. They are not real statistics from TGT.

## Automation 1: Early Departure Alert

For each department evaluated:

1. Count completed departures in the evaluated data.
2. Count early departures among those departures.
3. Calculate the early-departure share among departures using the same denominator.
4. Create a signal only when both conditions are true:
   - The department has at least 5 completed departures.
   - More than 35% of those departures are early.
5. When the conditions are met, create an `AutomationSignal` and an `InternalTask` assigned to HR.

The threshold is strictly greater than 35%; a value of exactly 35% does not trigger the rule. The minimum sample is 5 departures.

In the demonstration data, Warehouse triggers the rule: `9 / 18 = 50%` and it has at least 5 departures.

No additional department time window is specified for this automation. The evaluated data scope must be made explicit by the implementation and confirmed if it is intended to differ from the demonstration dataset.

## Automation 2: Overdue Onboarding Task

When a mandatory onboarding task is overdue and its status is not `Done`:

1. Create an `AutomationSignal` linked to the onboarding task.
2. Create an `InternalTask` assigned to the responsible person.

Do not create another internal task for the same active overdue-task problem on every repeated rule check. The active-signal deduplication rule below applies.

The requirements do not specify the exact date-boundary interpretation of “overdue” (for example, whether the due date itself counts as overdue). Confirm that boundary before implementation; do not silently choose a different business rule.

## General Automation Rules

- Automations are deterministic and use explicit business rules; they do not use AI.
- Rechecking rules must not create duplicate **active** signals for the same problem.
- For the Early Departure Alert, the same problem is the rule for the same department.
- For the Overdue Onboarding Task, the same problem is the rule for the same onboarding task.
- Active signals are those with status `New` or `In Progress`; `Resolved` signals are not active.
- If an active signal already exists for a problem, do not create another active signal or duplicate its associated internal task on a subsequent check.
- Signal statuses: `New`, `In Progress`, `Resolved`.
- Internal task statuses: `Open`, `In Progress`, `Done`.
- The signal and internal task are records in the local application queue; no external task is created.
- The thresholds are demonstration values, not industry standards.
