# Architecture: Newbie HR

## Architecture Overview

Newbie HR is a small frontend-only MVP. It runs as a React application in the browser, uses synthetic demonstration data, and has no backend, external APIs, or real HR-system integrations.

The application separates presentation, business logic, data access, and browser persistence. UI components display data and collect user actions; feature logic calculates metrics and evaluates explicit automation rules; data and service modules load seed data and persist changes in `localStorage`.

The internal task queue is an application feature that simulates creating and tracking HR tasks. It does not send tasks to Bitrix24 or another external system. The project is maintained in Git and published through Vercel.

The rules document referenced by `AGENTS.md` (`docs/BUSINESS_RULES.md`) is not present. Therefore, this architecture does not define metric formulas, thresholds, automation conditions, or other business rules. These must be agreed separately before implementation.

## Technology Stack

- **React and TypeScript** — browser UI and application logic.
- **Vite** — development server and build tooling.
- **Tailwind CSS** — styling.
- **Recharts** — charts in dashboard and analytics views.
- **Lucide React** — interface icons.
- **Browser `localStorage`** — persistence of application changes on the current browser and device.
- **Synthetic seed data** — initial demonstration dataset.
- **Git** — source control.
- **Vercel** — publication of the frontend application.

No additional libraries or services are part of this architecture.

## Application Layers and Responsibilities

### UI and presentation

The `app` and `components` areas are responsible for application composition, navigation, layout, reusable visual elements, forms, tables, charts, and displaying loading or error states. Feature screens render values supplied by feature logic; they do not implement HR formulas or read and write `localStorage` directly.

### Feature logic and business rules

The `features` area groups behavior by product capability, such as dashboard, analytics, automation center, employee list and profile, and feedback. Feature logic prepares view data, validates user input where applicable, and coordinates user actions with services.

Pure business functions calculate HR metrics and evaluate automation conditions. These functions are independent of React components and browser storage, so the same rule is not duplicated across screens. Their formulas and conditions must come from agreed business rules; they must not be inferred or invented in UI code.

### Data and persistence

The `data` area contains the synthetic seed dataset and its loading or initialization code. The `services` area provides the data access boundary for loading the initial state, reading and writing persisted changes, resetting to seed state, and applying changes to the internal task queue. Only this boundary accesses `localStorage`.

### Shared types and utilities

The `types` area defines shared TypeScript data shapes used across features and services. The `utils` area contains small, general-purpose helpers that are not specific to a product feature and do not contain HR business rules.

### Responsibility summary

- **Business logic:** metric calculation, automation-rule evaluation, and feature-level transformations or validation.
- **Display:** layout, navigation, components, charts, forms, tables, and presenting feature state.
- **Data storage:** seed loading, persisted-state loading and saving, and reset behavior through services.

## Proposed Project Structure

A compact structure suitable for the four-hour MVP could be:

```text
src/
  app/
    App.tsx
    ...
  components/
    ...
  features/
    dashboard/
      ...
    analytics/
      ...
    automation-center/
      ...
    employees/
      ...
    feedback/
      ...
  data/
    seed.json
    ...
  services/
    ...
  types/
    ...
  utils/
    ...
```

This is a proposed organization, not a requirement to create every folder or file. Keep each feature small; add only the modules needed by implemented MVP screens. Components belong in `components` when they are genuinely shared. Feature-specific UI and business logic should remain grouped in the corresponding `features` directory. Put metric and automation functions with their feature or in a clearly named business-logic module, not in presentation components.

## Data Flow

1. On application startup, the data service checks for a saved application state in `localStorage`.
2. If a valid saved state exists, the application uses it. Otherwise, the service initializes state from the synthetic seed data and persists that initial state.
3. Feature logic derives display-ready values from the current data. Analytics calculations and automation evaluations use business functions, not chart components.
4. A user action in the UI is passed to the relevant feature logic and data service.
5. The service applies the change to application state and persists it to `localStorage`.
6. The UI reflects the updated state. Signals and internal tasks are represented in the same application data and task queue; no external request is made.

The exact handling of invalid or outdated saved data should remain simple and be decided during implementation; it must not silently introduce business-rule changes.

## State Management and Persistence

For this MVP, application state can use React's built-in state mechanisms. A separate state-management library is not required. Keep shared state at the smallest common application or feature boundary that needs it.

The persisted state should contain only the synthetic application data and user changes needed to demonstrate the product scenarios, including changes to the internal queue. The exact state shape belongs in the data model and should be shared through TypeScript types. UI-only state, such as an open menu or temporary form input, does not need to be persisted unless required by a user scenario.

All `localStorage` access goes through services. Services should handle serialization and parsing at this boundary rather than spreading storage calls through components. Provide a reset action that restores the original demonstration state from the seed data and replaces the current persisted state. Reset affects only this application's browser storage; it does not contact or alter any external system.

`localStorage` is browser- and device-local, not a shared database. Changes are not synchronized between users or devices.

## Analytics Architecture

Analytics calculations belong in business-logic functions separate from React components and Recharts configuration. These functions accept typed application data and return values suitable for dashboard metrics, department comparisons, and departure-reason breakdowns. Components render those results; chart configuration handles presentation only.

Metric definitions, time windows, denominators, and treatment of incomplete data must follow the agreed business rules. Since `docs/BUSINESS_RULES.md` is missing, this document deliberately does not specify formulas or default interpretations. Confirm those definitions before implementing metrics.

## Automation Architecture

Automations are deterministic functions based on transparent, agreed business rules; they do not use AI. The MVP includes the two automation categories stated in the product document: an elevated share of early departures and overdue onboarding tasks.

Rule evaluation belongs in feature/business logic, separate from display and persistence. When an agreed condition is met, the application can represent the resulting signal and internal task in its internal queue through the data service. The Automation Center displays those records and allows HR to track their status. This queue simulates task creation and tracking locally and does not connect to Bitrix24.

The precise thresholds, evaluation conditions, evaluation timing, and duplicate-signal behavior are not defined here. They require agreed business rules before implementation.

## Error Handling

Handle failures at the boundary where they occur and show a useful interface state without exposing technical details to the user:

- If saved state cannot be read or parsed, do not treat the unreadable value as valid application data. Provide a clear recovery path, such as restoring the seed state, subject to the agreed reset interaction.
- If persistence fails, keep the UI usable where possible and inform the user that the change may not have been saved.
- If required data is unavailable for a view, show an explicit empty or error state rather than presenting misleading values.

The application should not silently substitute fabricated business results for missing or invalid data.

## Development Constraints

- Keep the application frontend-only: no backend, API, external service, or real integration.
- Use synthetic data only; all demo people and outcomes are fictional.
- Do not add dependencies beyond the agreed stack without approval.
- Keep UI, business logic, data access, and local persistence separate.
- Keep metric calculations and automation rules out of presentation components.
- Use transparent business rules, not AI; do not add external AI APIs.
- Do not define or change business rules without agreement. `docs/BUSINESS_RULES.md` is currently missing, so metric formulas and automation conditions remain unspecified.
- Keep the implementation proportionate to a small MVP with a four-hour time constraint; avoid abstractions and infrastructure that are not needed for the listed scenarios.
- Treat Git as source control and Vercel as the publication target; neither implies a backend or runtime integration.
