# 📋 How to Update `context.md`

> This file is a guide for **AI tools and developers** on how to properly maintain `context.md`.
> Follow these rules every time you make meaningful changes to the project.

---

## ✅ When to Update `context.md`

Update the context file when you:

- [ ] Add, remove, or rename a file or folder in the project
- [ ] Install or remove a dependency
- [ ] Make an architectural decision (e.g., chose X over Y)
- [ ] Add a new feature or page
- [ ] Change environment variables or configuration
- [ ] Discover and fix a bug worth remembering
- [ ] Start or finish a meaningful work session

---

## 📝 Update Checklist

When updating `context.md`, always:

1. **Update `Last Updated`** — change the date at the top
2. **Update `Current State`** — reflect the actual project state (e.g., `🚧 Early Dev`, `✅ Feature Complete`, `🐛 Bug Fixing`)
3. **Update the relevant section** — don't just touch the session log
4. **Add a Session Log entry** — one short paragraph or bullet list, newest at top
5. **Keep it brief** — if an entry needs more than 3 bullet points, summarize

---

## 🧱 Section Guide

### Project Overview Table
Update when: project name, purpose, framework, or runtime changes.

### Project Structure
Update when: new directories or key files are added/removed.
Use the tree format already established. Mark empty dirs with `(empty)`.

### Tech Stack & Key Decisions
Update when: new packages are added, or a major decision is made about technology.

### Feature Roadmap
Update when: a feature is planned, in progress, or completed.

Use these status icons:
| Icon | Meaning |
|---|---|
| 🔲 | Planned |
| 🔄 | In Progress |
| ✅ | Completed |
| ❌ | Cancelled / Removed |

### Architecture Decisions
Update when: a significant architectural choice is made.

Format:
```
### [YYYY-MM-DD] <Short Title>
- Decision made: ...
- Reason: ...
- Alternatives considered: ...
```

### Environment & Configuration
Update when: new env variables or external services are added.

### Known Issues & Gotchas
Update when: a bug is found or fixed, or an important quirk is discovered.

Format:
```
- [YYYY-MM-DD] **Issue title** — short description. Status: open/fixed
```

### Session Log
Update at the end of every meaningful work session.

Format:
```
### YYYY-MM-DD — <Brief Title>
- What was done (bullet points)
- What changed
- What's next (optional)
```

---

## ❌ What NOT to Do

- Do **not** delete past session log entries
- Do **not** write long paragraphs — keep everything scannable
- Do **not** put implementation details here that belong in code comments
- Do **not** leave `context.md` stale after a work session
- Do **not** duplicate information that's already in `README.md` — reference it instead
