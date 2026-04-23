# GLOBAL CONTEXT — VentureLens

> **Last Updated:** 2026-04-23 | **Maintained By:** Core Team

---

## Project Overview

**Project Name:** VentureLens
**Type:** AI-Powered SaaS Platform
**Category:** Startup Idea Validation & Team Formation
**Repository:** `magardeyash/minorproject`
**Current Phase:** Initial Development

VentureLens enables early-stage founders to validate their startup ideas through AI-driven analysis, quantified scoring, and structured insights — all before committing time or capital to execution. Each idea submission triggers an AI evaluation covering:

- Market potential & sizing
- Industry trend alignment
- Competitive landscape analysis
- Feasibility assessment
- Risk identification
- Actionable improvement suggestions

Each evaluated idea receives a **Venture Score** (0–100). Ideas that cross a defined benchmark unlock access to a **Contributor Ecosystem**, where skilled individuals (developers, designers, marketers, etc.) can discover and apply to promising ideas. This creates a full loop: validate → score → attract talent → execute.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React framework, SSR/SSG) |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| AI Layer | AI APIs (e.g., Gemini / OpenAI) + ML-based scoring logic |
| Authentication | JWT (JSON Web Tokens) |
| Architecture | RESTful APIs, Modular design |
| Deployment | TBD (Vercel for frontend, Railway/Render for backend) |
| Version Control | Git + GitHub |
| Package Manager | npm |

---

## System Architecture (High-Level)

```
[ Founder ] ──submits idea──▶ [ Next.js Frontend ]
                                      │
                              [ Express API Server ]
                             /         │          \
                  [ MongoDB ]   [ AI API Layer ]  [ JWT Auth ]
                                      │
                              [ Scoring Engine ]
                                      │
                         Venture Score ≥ Threshold?
                            YES ──▶ [ Contributor Ecosystem ]
                            NO  ──▶ [ Improvement Suggestions ]
```

---

## Coding Rules

### General
- All Next.js pages must use **functional components** with React Hooks.
- Backend routes must follow **RESTful conventions** (GET, POST, PUT, DELETE).
- All business logic must live in **service layer** files, not directly in route handlers.
- Environment-specific configs must use `.env.local` (frontend) and `.env` (backend). Never commit these files.

### Naming Conventions
| Artifact | Convention | Example |
|---|---|---|
| React components | PascalCase | `IdeaCard.jsx` |
| API route files | kebab-case | `idea-routes.js` |
| DB models | PascalCase + singular | `Idea.js`, `User.js` |
| Utility functions | camelCase | `calculateVentureScore.js` |
| CSS modules | camelCase | `ideaCard.module.css` |

### API Design
- All API responses must follow a consistent envelope:
  ```json
  { "success": true, "data": {}, "message": "..." }
  { "success": false, "error": "...", "code": 400 }
  ```
- All routes behind authentication must validate the JWT in middleware — never inline.
- Paginate all list endpoints using `?page=` and `?limit=` query params.

### Database
- All Mongoose schemas must include `createdAt` and `updatedAt` timestamps (`{ timestamps: true }`).
- Never store plain-text passwords — always use bcrypt.
- Index fields that are frequently queried (e.g., `userId`, `ventureScore`, `status`).

### Git Workflow
- Branch naming: `feature/<name>`, `fix/<name>`, `chore/<name>`, `ai/<name>`
- Commit messages: Conventional Commits — `feat(ideas): add venture score calculation`
- All PRs require at least one review before merge to `main`.

---

## DO Rules ✅

- Always handle loading, error, and empty states in every UI component.
- Always validate request bodies in Express using a validation middleware (e.g., Joi or Zod).
- Always add a new entry to `DECISIONS_LOG.md` for any architectural or tooling decision.
- Always update `CURRENT_STATE.md` when a feature completes or a blocker is discovered.
- Always write JSDoc comments for all service-layer functions.
- Always keep the AI prompt templates versioned in `/ai/prompts/`.

## DON'T Rules ❌

- Do NOT commit directly to `main`. Always use feature branches.
- Do NOT hardcode API keys, secrets, or MongoDB URIs. Use environment variables exclusively.
- Do NOT call AI APIs from the frontend — all AI calls must go through the backend.
- Do NOT leave `console.log` statements in production-bound code.
- Do NOT expose full MongoDB documents to the client — always select only required fields.
- Do NOT add new npm packages without team discussion and a `DECISIONS_LOG.md` entry.

---

## Key Contacts

| Role | Name / Handle |
|---|---|
| Project Owner | @magardeyash |
| Frontend Lead | TBD |
| Backend Lead | TBD |
| AI/ML Lead | TBD |
| AI Assistant | Antigravity (Google DeepMind) |
