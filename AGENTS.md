# Project Overview

Newbie HR is a demo HR Intelligence Dashboard for analyzing new employee onboarding and early turnover. Its goal is to identify onboarding problems, find departments with elevated rates of early departures, and help HR make informed decisions.

# Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- localStorage
- Synthetic JSON data

# Development Principles

- Use TypeScript and avoid `any`.
- Separate UI, business logic, and data access.
- Build small, reusable components.
- Do not duplicate business logic.
- Keep code readable and simple.
- Do not add architectural complexity without a need.

# Business Rules

- Do not invent or change business rules independently.
- Metric formulas and automation conditions must conform to `docs/BUSINESS_RULES.md`.
- If that document is missing or requirements contradict one another, report this before proceeding.

# Project Documentation

Before implementing relevant tasks, study:

- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/BUSINESS_RULES.md`

Do not invent the contents of missing documents.

# Restrictions

- Do not connect real HR systems or Bitrix24.
- Do not use real personal data.
- Do not connect external AI APIs within the application.
- Do not add a backend without approval.
- Do not install new dependencies without explaining why they are necessary and obtaining approval.
- Do not change the architecture or business rules independently.
- Do not delete existing files without approval.

# Working Process

- Briefly explain the plan before carrying out a complex task.
- Study the existing code and documentation first.
- Make changes in small, logical steps.
- Run appropriate checks after making changes.
- Do not claim tests passed if they were not run.
- At the end, report which files were changed, what was done, and what remains to be checked.
- Explain important technical decisions.

# Communication

- Communicate with the user in Russian.
- Write code, variable names, comments, and technical documentation in English.
- Explain complex decisions in plain language.
- Do not hide errors or limitations.
