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

> **Last Updated:** 2026-04-23
> **Current State:** 🚧 Early Development — Project bootstrapped, structure being defined
> **Project Type:** Next.js 15 Web Application (Minor Project)

---

## 🎯 Project Overview

| Field | Value |
|---|---|
| **Project Name** | `minorproject` |
| **Purpose** | Minor Project (details to be defined as development progresses) |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Runtime** | React 19 |
| **Dev Server** | `npm run dev` (Turbopack enabled) |

---

## 🗂️ Project Structure

```
minorproject/
├── app/                    # Next.js App Router — pages & layouts
│   ├── layout.tsx          # Root layout (Geist font, metadata)
│   ├── page.tsx            # Home page (default Next.js starter)
│   └── globals.css         # Global styles
├── features/               # Feature modules (currently empty)
├── context/                # 📍 YOU ARE HERE — project context files
│   ├── context.md          # Global project context (this file)
│   └── UPDATE_TEMPLATE.md  # Guide for updating this context file
├── public/                 # Static assets
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
- Dark mode: handled via Tailwind's `dark:` variants

### TypeScript
- Strict mode enabled
- Path aliases not yet configured (default `@/*` from `create-next-app`)

### Dependencies
| Package | Version | Role |
|---|---|---|
| `next` | 15.5.15 | Framework |
| `react` | 19.1.0 | UI library |
| `react-dom` | 19.1.0 | DOM rendering |
| `tailwindcss` | ^4 | Styling |
| `typescript` | ^5 | Type safety |

---

## 📋 Feature Roadmap

> Update this section as features are planned and built.

| Status | Feature | Notes |
|---|---|---|
| ✅ | Custom Authentication | NextAuth v5, JWT, Credentials, Server Actions, Zod validation |
| 🔲 Planned | (to be defined) | — |

---

## 🏗️ Architecture Decisions

> Log all significant architectural decisions (ADRs) here. Add new ones at the top.

### [2026-04-23] Authentication System
- Decision made: Implemented NextAuth v5 (Auth.js) with JWT strategy and custom UI.
- Database Connection: Decided to use Supabase PostgreSQL (currently stubbed, waiting for Phase 2 implementation).
- Why: Complete control over the aesthetics (using the targeted color palette) and clean server action architecture.

### [2026-04-23] Project Bootstrap
- Bootstrapped with `create-next-app` using default settings
- App Router chosen (not Pages Router)
- `features/` folder created for future feature-based modular structure
- `context/` folder created for persistent AI context management

---

## 🔑 Environment & Configuration

> List any required environment variables, external services, or config notes.

| Variable | Description | Required |
|---|---|---|
| `AUTH_SECRET` | NextAuth encryption secret (32 random chars) | Yes |
| `NEXTAUTH_URL` | Application canonical URL | Yes |
| `DATABASE_URL` | Supabase Postgres URL (Pending connection) | Soon |

---

## ⚠️ Known Issues & Gotchas

> Document bugs, quirks, or important warnings here.

- [2026-04-23] Database queries in `register.ts` and `auth.ts` are currently mocked (`// TODO: Supabase` blocks). The user registers virtually but isn't saved to an actual DB.

---

## 📝 Session Log

> Brief log of what was done each session. Newest entries at the top.

### 2026-04-23 — Auth Implementation
- Created complete auth system implementation using NextAuth v5 and JWT sessions.
- Added design tokens mapping to palette (`#213722`, `#EAED87`, `#F8C662`).
- Created beautiful, animated `LoginForm` and `RegisterForm` components.
- Added `lucide-react`, `clsx`, `tailwind-merge` for UI utility.
- Tested and fixed all TypeScript errors (`tsc --noEmit`).

### 2026-04-23 — Initial Setup
- Project created with `create-next-app` (Next.js 15, TypeScript, Tailwind CSS)
- `features/` and `context/` directories created
- `context.md` and `UPDATE_TEMPLATE.md` set up for persistent AI context
- Default Next.js starter page is still in place (`app/page.tsx`)
