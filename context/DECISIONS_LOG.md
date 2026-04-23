# DECISIONS LOG

> **Last Updated:** 2026-04-23
> 
> *Record all significant architectural, tooling, and process decisions here.*

---

## [2026-04-23] Decision: Use Next.js for Frontend
**Context:** We need a robust framework for the frontend that supports SEO (for public-facing pages) and dynamic client-side rendering (for dashboards).
**Decision:** Selected Next.js (App Router).
**Reasoning:** 
- Built-in routing simplifies development.
- Server-Side Rendering (SSR) is crucial for landing pages to attract founders.
- React ecosystem compatibility ensures we can find libraries easily.
**Alternatives Considered:** React (Vite) + React Router (Rejected: Lacks built-in SSR).
**Impact:** Frontend will be a separate Next.js application, likely deployed on Vercel.

---

## [2026-04-23] Decision: Use MongoDB for Database
**Context:** We need a database to store user profiles, startup ideas, and complex, unstructured AI evaluation reports.
**Decision:** Selected MongoDB (via Mongoose).
**Reasoning:** 
- Flexible schema design is ideal for storing varied AI JSON responses.
- High scalability for read-heavy operations (e.g., browsing ideas in the contributor ecosystem).
- Easy integration with Node.js/Express.
**Alternatives Considered:** PostgreSQL (Rejected: Rigid schema makes storing dynamic AI output slightly more complex initially).
**Impact:** Need to ensure strict validation at the application layer using Mongoose schemas.

---

## [2026-04-23] Decision: Separation of Frontend and Backend
**Context:** Deciding between a monolithic Next.js app (using Next.js API routes) vs. a separate Node.js/Express backend.
**Decision:** Separate Node.js/Express backend.
**Reasoning:** 
- The AI scoring logic might become computationally heavy or require specialized Python microservices later. A separate backend provides a cleaner boundary.
- Easier to scale the backend independently if idea processing becomes a bottleneck.
- Cleaner separation of concerns for the team.
**Alternatives Considered:** Fullstack Next.js (Rejected: Tightly couples frontend and backend logic).
**Impact:** Requires managing two separate codebases/directories and handling CORS.
