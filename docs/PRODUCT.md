# Product: Newbie HR

## 1. Business Context

ТГТ is a company engaged in wholesale and retail trade in sporting goods. The company has approximately 400 employees and hires more than 100 new employees each year. Employee hiring and termination processes are organized through tasks in Bitrix24.

According to the company's source information, approximately one in three employees who leave the company does not stay for three months. HR has difficulty identifying onboarding problems in time and understanding why new employees leave.

These are the initial conditions of the test assignment. They are not data received by the application from a real system.

## 2. Product Vision

Newbie HR is an HR Intelligence Dashboard that helps:

- Analyze the onboarding of new employees.
- Identify departments with an elevated share of early departures.
- Find recurring problems.
- Monitor the completion of onboarding tasks.
- Help HR make data-informed decisions.

## 3. Target Users

- **HR specialists** — analyze metrics and onboarding problems.
- **HR managers** — monitor departments and make decisions.
- **Department managers** — receive tasks to improve onboarding.

## 4. Core User Scenarios

1. HR opens the Dashboard and sees key metrics.
2. HR compares departments and identifies problem areas.
3. HR analyzes the reasons for early departures.
4. The system detects a deviation according to configured rules.
5. The system creates an internal task for the responsible person.
6. HR tracks the status of signals and tasks.

## 5. MVP Scope

### Priority 1

- Dashboard with key HR metrics.
- Analytics broken down by department and reasons for departure.
- Automation Center with signals and an internal task queue.
- Two main automations: an elevated share of early departures and overdue onboarding tasks.

### Priority 2

- A simplified employee list.
- An employee profile and onboarding status.
- A new employee survey about the onboarding process.

## 6. Employee Feedback

The survey should help identify onboarding problems.

- Responses associated with an employee are described as **confidential**, not anonymous.
- Users must be told who can see the responses.
- Optional questions may be skipped.
- Employees must not be forced to explain a low rating.

## 7. Product Boundaries

Within the MVP:

- Synthetic data only.
- Frontend-only application.
- Changes are stored in localStorage.
- An internal task queue is used instead of real Bitrix24.
- No external AI APIs are used within the product.
- No backend or real integrations.

## 8. Success Criteria

- HR can see key metrics.
- A department with an elevated share of early departures can be identified.
- The main automation rules work.
- Created signals appear in the internal task queue.
- The interface demonstrates a complete primary user scenario.

## 9. Demo Data Disclaimer

All employees, departments, departures, reasons, and survey results in the demo are fictional. They are not real statistics from ТГТ.

## 10. Out of Scope

- Real Bitrix24 integration.
- Real personal data.
- AI analysis of employee text.
- Machine-learning-based turnover prediction.
- A full-fledged human resource management system.
