<!--
╔══════════════════════════════════════════════════════════════════════════════╗
║                    ⚠️  AI TOOL — READ THIS FIRST ⚠️                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  This file is the SINGLE SOURCE OF TRUTH for project context.               ║
║                                                                              ║
║  RULES FOR ANY AI ASSISTANT WORKING ON THIS PROJECT:                        ║
║                                                                              ║
║  1. READ THIS FILE IN FULL before writing a single line of code.            ║
║  2. NEVER contradict or ignore decisions documented here.                   ║
║  3. ALWAYS UPDATE THIS FILE after completing meaningful work:               ║
║       - Add new decisions under the relevant section                        ║
║       - Update "Current State" and "Last Updated" fields                    ║
║       - Keep entries BRIEF — bullet points, not essays                      ║
║  4. Follow the UPDATE_TEMPLATE.md in this folder for formatting rules.      ║
║  5. Do NOT delete historical decisions — append or amend instead.           ║
║  6. If you are unsure about something, document your assumption here        ║
║     and flag it to the user.                                                ║
╚══════════════════════════════════════════════════════════════════════════════╝
-->

# 📦 Project Global Context

> **Last Updated:** 2026-04-29
> **Current State:** 🚧 Active Development — Database integrated, Auth flows finalized, UI polished, Role-specific dashboards fully built
> **Project Type:** Next.js 15 Web Application (VentureLens SaaS)

---

## 🎯 Project Overview

| Field | Value |
|---|---|
| **Project Name** | `minorproject` (VentureLens) |
| **Purpose** | AI-powered platform to validate startup ideas and connect founders with contributors |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Runtime** | React 19 |
| **Dev Server** | `npm run dev` (Turbopack enabled) |

---

## 🗂️ Project Structure

```
minorproject/
├── actions/                # Server Actions
│   ├── admin.ts            # Toggle user active/inactive status
│   ├── applications.ts     # Apply to idea, update application status
│   ├── ideas.ts            # Submit idea, update idea status (approve/reject)
│   └── auth/               # login.ts, register.ts
├── app/                    # Next.js App Router — pages & layouts
│   ├── (auth)/             # Route group for separated login/register flows
│   │   ├── login/          # /login/founder, /login/employee, /login/admin
│   │   └── register/       # /register/founder, /register/employee
│   ├── admin/dashboard/    # Admin control panel
│   │   ├── layout.tsx      # Admin sidebar layout
│   │   ├── page.tsx        # Admin overview (platform metrics)
│   │   ├── users/          # User management (activate/suspend)
│   │   └── ideas/          # Idea moderation (approve/reject)
│   ├── dashboard/
│   │   ├── page.tsx        # Role-based redirect (→ founder/employee/admin)
│   │   ├── employee/       # Employee (Contributor) dashboard
│   │   │   ├── layout.tsx  # Employee sidebar layout
│   │   │   ├── page.tsx    # Employee overview (stats)
│   │   │   ├── browse/     # Browse & apply to approved ideas
│   │   │   ├── applications/ # Track own application statuses
│   │   │   └── profile/    # View own profile
│   │   └── founder/        # Founder dashboard
│   │       ├── layout.tsx  # Founder sidebar layout
│   │       ├── page.tsx    # Founder overview (idea stats)
│   │       ├── ideas/      # List of own submitted ideas
│   │       │   └── new/    # Submit new idea form
│   │       └── applicants/ # Review applications to own ideas
│   ├── api/db/init/        # GET endpoint to bootstrap all DB tables
│   ├── layout.tsx          # Root layout (Geist font, metadata)
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── auth/               # AuthCard, LoginForm, RegisterForm
│   ├── dashboard/          # Reusable dashboard UI components
│   │   ├── ApplyForm.tsx   # Client form: employee applies to an idea
│   │   ├── DataTable.tsx   # Generic data grid
│   │   ├── IdeaCard.tsx    # Card to display a startup idea
│   │   ├── Sidebar.tsx     # Collapsible role-aware navigation sidebar
│   │   ├── StatsCard.tsx   # KPI stat display card
│   │   ├── StatusBadge.tsx # Color-coded status pill
│   │   └── SubmitIdeaForm.tsx # Client form: founder submits an idea
│   ├── landing/            # Landing page sections (Navbar, Hero, etc.)
│   └── ui/                 # Generic inputs: FormInput, SelectInput, etc.
├── lib/
│   ├── db/
│   │   ├── applications.ts # DB queries for idea applications
│   │   ├── ideas.ts        # DB queries for startup ideas
│   │   └── users.ts        # DB queries for users
│   ├── db.ts               # Neon serverless SQL client
│   └── validations.ts      # Zod schemas (Login, Register, Idea, Application)
├── context/                # 📍 YOU ARE HERE — project context files
├── middleware.ts            # Route guards: role-enforcement per path
├── auth.ts                 # NextAuth v5 config (Credentials provider, JWT)
├── next.config.ts          # Next.js configuration
└── package.json
```

---

## 🛠️ Tech Stack & Key Decisions

### Framework
- **Next.js 15** with **App Router** (not Pages Router)
- **Turbopack** enabled for both `dev` and `build`

### Styling
- **Tailwind CSS v4** (`@tailwindcss/postcss` plugin)
- **Geist Sans** and **Geist Mono** fonts (via `next/font/google`)
- Glassmorphism design system (Amber & Forest Green palette)

### Database
- **Neon PostgreSQL** via `@neondatabase/serverless`
- Pure SQL queries (no ORM like Prisma or Drizzle)

### TypeScript
- Strict mode enabled

---

## 📋 Feature Roadmap

> Update this section as features are planned and built.

| Status | Feature | Notes |
|---|---|---|
| ✅ | Custom Authentication | NextAuth v5, JWT, Credentials provider, Server Actions, Zod |
| ✅ | Database Integration | Neon Serverless PostgreSQL — `users`, `ideas`, `applications` tables |
| ✅ | Role-based Auth | Distinct login/register flows for Founder, Employee (Contributor), and Admin |
| ✅ | Landing Page | Modern SaaS landing page with features, testimonials, CTA |
| ✅ | Admin Dashboard | Overview metrics, User Management (suspend/activate), Idea Moderation (approve/reject) |
| ✅ | Founder Dashboard | Overview, Submit Idea, My Ideas, Review Applicants |
| ✅ | Employee Dashboard | Overview, Browse Ideas (with Apply), My Applications, Profile |
| ✅ | Role-based Routing | `middleware.ts` enforces `/dashboard/founder`, `/dashboard/employee`, `/admin/dashboard` |
| 🔲 Planned | AI Idea Evaluation | AI-based idea validation and Venture Score calculation |

---

## 🏗️ Architecture Decisions

> Log all significant architectural decisions (ADRs) here. Add new ones at the top.

### [2026-04-29] Admin Credentials Database Migration
- Migrated admin authentication from hardcoded environment variables in `auth.ts` to standard DB-backed authentication.
- Extended `UserRole` type and `users_role_check` DB constraint to include the `admin` role.
- Seeded the initial admin user into the database securely with bcrypt hashing.

### [2026-04-29] Dashboard Separation by Role
- Split the monolithic `/dashboard` into `/dashboard/founder` and `/dashboard/employee` to cleanly separate UI and logic for each role.
- Added new DB modules (`ideas` and `applications`) to support the core platform workflow instead of using a unified `users` module for everything.
- Implemented global `Sidebar` component for navigation consistency.

### [2026-04-26] Hydration Error Fixes
- Replaced nested component definitions inside components (like `Logo` inside `Navbar`) with inline variables to fix React SSR hydration mismatches.
- Applied `suppressHydrationWarning` on `next/image` when dealing with UI that requires conditional rendering based on SSR and client execution.

### [2026-04-26] Role-based Authentication Structure
- Separated authentication into discrete routes (`/login/founder`, `/login/employee`, `/login/admin`).
- Re-used `AuthCard` to standardise "thick" UI borders and shadow depth for forms.

### [2026-04-26] Database Integration
- Shifted from mocked Supabase DB to a live Neon PostgreSQL database using `@neondatabase/serverless`.
- Built custom `/api/db/init` endpoint to bootstrap database tables.

### [2026-04-23] Authentication System
- Decision made: Implemented NextAuth v5 (Auth.js) with JWT strategy and custom UI.
- Why: Complete control over the aesthetics (using the targeted color palette) and clean server action architecture.

---

## 🔑 Environment & Configuration

> List any required environment variables, external services, or config notes.

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | Neon Postgres Connection String | Yes |
| `AUTH_SECRET` | NextAuth encryption secret (32+ chars) | Yes |
| `NEXTAUTH_URL` | Application canonical URL (`http://localhost:3000`) | Yes |
| `ADMIN_EMAIL` | Seeded admin email (default: `admin@venturelens.ai`) | Optional |
| `ADMIN_PASSWORD` | Seeded admin password (default: `Admin@VL2024!`) | Optional |

---

## ⚠️ Known Issues & Gotchas

> Document bugs, quirks, or important warnings here.

- Ensure to run `http://localhost:3000/api/db/init` upon initial deployment to provision database tables if not already present.
- Admin login route is `/login/admin`. Admins cannot register.
- Turbopack workspace root must be explicitly set to project root in `next.config.ts` if a parent directory contains lockfiles.
- **Next.js 15 Server Actions:** Inline arrow function server actions are invalid inside `.map()` loops. Use named inner async functions instead.
- **Form Actions & Server Actions:** Server actions passed to native `<form action={...}>` must have a return type of `void`. If returning `{ error: string }`, the form must be extracted into a Client Component using `useTransition` and custom event handlers.
- **Zod v4 API Change:** Use `parsed.error.issues` instead of `parsed.error.errors`.

---

## 📝 Session Log

> Brief log of what was done each session. Newest entries at the top.

### 2026-04-29 — Dashboard Implementation & Bug Fixes
- Designed and built separate dashboard interfaces for Admin, Founder, and Employee roles.
- Created `ideas` and `applications` DB tables with full raw SQL queries.
- Built reusable UI components: `Sidebar`, `StatsCard`, `DataTable`, `IdeaCard`, `StatusBadge`.
- Implemented Server Actions for submitting ideas, updating statuses, applying to ideas, and toggling user accounts.
- Updated `middleware.ts` to enforce routing logic to `/dashboard/founder`, `/dashboard/employee`, and `/admin/dashboard`.
- Fixed React hydration mismatches (missing `React` imports) across various dashboard components.
- Resolved Next.js 15 issues with inline Server Actions in `.map()` loops by extracting to named inner async functions.
- Extracted inline form logic to Client Components (`ApplyForm`, `SubmitIdeaForm`) to resolve Server Action `void` return type mismatches.
- Migrated admin credentials from hardcoded environment variables to the Postgres database, modifying the `users_role_check` constraint.

### 2026-04-26 — Production UI & Neon DB
- Migrated mocked auth to live Neon PostgreSQL database.
- Split auth UI into separate `/login` and `/register` routes for Founders, Contributors, and Admins.
- Implemented Landing page (Navbar, Hero, Features, Testimonials).
- Fixed styling of Auth forms to make them more prominent (thick borders, strong shadows).
- Fixed logo sizing and Navbar layout gap issues.
- Fixed React hydration mismatch errors in Navbar and setup Next.js Image caching correctly.
- Hardcoded Admin authentication in `auth.ts`.
- Pushed complete initial implementation to GitHub.

### 2026-04-23 — Auth Implementation
- Created complete auth system implementation using NextAuth v5 and JWT sessions.
- Added design tokens mapping to palette (`#213722`, `#EAED87`, `#F8C662`).
- Created beautiful, animated `LoginForm` and `RegisterForm` components.
- Added `lucide-react`, `clsx`, `tailwind-merge` for UI utility.

### 2026-04-23 — Initial Setup
- Project created with `create-next-app` (Next.js 15, TypeScript, Tailwind CSS)
- `features/` and `context/` directories created
- `context.md` and `UPDATE_TEMPLATE.md` set up for persistent AI context
