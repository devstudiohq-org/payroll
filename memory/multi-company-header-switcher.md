---
name: multi-company-header-switcher
description: The header company name is a planned multi-company switcher; leave it hardcoded until backend logic exists
metadata:
  type: project
---

The payroll platform will let a user manage/run payroll for multiple companies. The active company name is shown in the app `Header` and the Settings → Companies tab, both reading from a single hardcoded constant `CURRENT_COMPANY_NAME` in `apps/web/src/data/company.ts` ("TechNova Solutions").

**Why:** Deliberately static for now — the user wants real switching wired up only after the backend/multi-tenancy logic exists.

**How to apply:** The switcher *UI* now exists (Settings → Companies tab: `apps/web/src/pages/settings/CompaniesTab.tsx` — active-company banner, search, "Create New Company" card, and company-card grid with a "Switch to this company" action). It renders from an empty typed `Company[]` until the database is connected. Don't wire actual switching or plumb org data into a store/context yet; when the backend lands, replace the `CURRENT_COMPANY_NAME` constant + the empty `companies` array with the real source. Dashboard data follows the same seam pattern in `apps/web/src/data/dashboard.ts`.
