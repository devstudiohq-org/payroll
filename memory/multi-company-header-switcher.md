---
name: multi-company-header-switcher
description: The header company name is a planned multi-company switcher; leave it hardcoded until backend logic exists
metadata:
  type: project
---

The payroll platform will let a user manage/run payroll for multiple companies. The company name shown in the app `Header` (currently hardcoded "TechNova Solutions") is intended to become the active-company selector/switcher.

**Why:** It's deliberately left static for now — the user wants it wired up only after the underlying logic and functions are built, not during the dashboard frontend work.

**How to apply:** Don't propose plumbing org data into the `Header`/`AppShell` yet. Dashboard page data was centralized in `apps/web/src/data/dashboard.ts` (see the API seam comment there), but the global header switcher is a separate, later task.
