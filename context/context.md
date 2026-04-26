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

> **Last Updated:** 2026-04-26
> **Current State:** 🚧 Active Development — Database integrated, Auth flows finalized, UI polished
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
├── actions/                # Server Actions (auth, etc)
├── app/                    # Next.js App Router — pages & layouts
│   ├── (auth)/             # Route group for separated login/register flows
│   ├── admin/              # Admin dashboard
│   ├── dashboard/          # Main user dashboard
│   ├── layout.tsx          # Root layout (Geist font, metadata)
│   ├── page.tsx            # Landing page 
│   └── globals.css         # Global styles
├── components/             # Reusable UI components
│   ├── auth/               # Forms and Cards for authentication
│   ├── landing/            # Landing page sections
│   └── ui/                 # Generic inputs and base components
├── context/                # 📍 YOU ARE HERE — project context files
│   ├── context.md          # Global project context (this file)
│   └── UPDATE_TEMPLATE.md  # Guide for updating this context file
├── lib/                    # Utilities and DB config
│   ├── db/                 # DB schema and functions
│   └── validations.ts      # Zod schemas
├── public/                 # Static assets (including logo)
├── next.config.ts          # Next.js configuration
├── tailwind.config.*       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
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
| ✅ | Custom Authentication | NextAuth v5, JWT, Credentials, Server Actions, Zod validation |
| ✅ | Database Integration | Neon Serverless PostgreSQL |
| ✅ | Role-based Auth | Distinct flows for Founder, Contributor (Employee), and Admin |
| ✅ | Landing Page | Modern SaaS landing page with features, testimonials, CTA |
| 🔲 Planned | Idea Evaluation | AI-based idea validation and Venture Score calculation |

---

## 🏗️ Architecture Decisions

> Log all significant architectural decisions (ADRs) here. Add new ones at the top.

### [2026-04-26] Hydration Error Fixes
- Replaced nested component definitions inside components (like `Logo` inside `Navbar`) with inline variables to fix React SSR hydration mismatches.
- Applied `suppressHydrationWarning` on `next/image` when dealing with UI that requires conditional rendering based on SSR and client execution.

### [2026-04-26] Role-based Authentication Structure
- Separated authentication into discrete routes (`/login/founder`, `/login/employee`, `/login/admin`).
- Hardcoded admin access inside `auth.ts` to prevent open registration for administrators.
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
| `NEXTAUTH_SECRET` | NextAuth encryption secret (32 random chars) | Yes |
| `NEXTAUTH_URL` | Application canonical URL (`http://localhost:3000`) | Yes |
| `AUTH_URL` | Application auth URL (`http://localhost:3000`) | Yes |
| `ADMIN_EMAIL` | Credentials for hardcoded admin login | Yes |
| `ADMIN_PASSWORD` | Credentials for hardcoded admin login | Yes |

---

## ⚠️ Known Issues & Gotchas

> Document bugs, quirks, or important warnings here.

- Ensure to run `http://localhost:3000/api/db/init` upon initial deployment to provision database tables if not already present.
- Admin login route is `/login/admin`. Admins cannot register.
- Turbopack workspace root must be explicitly set to project root in `next.config.ts` if a parent directory contains lockfiles.

---

## 📝 Session Log

> Brief log of what was done each session. Newest entries at the top.

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
