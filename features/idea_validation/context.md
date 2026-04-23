# FEATURE: Idea Validation Engine

> **Status:** Planning

## Purpose
The core value proposition of VentureLens. This feature allows founders to submit a structured description of their startup idea and receive an AI-generated evaluation (Venture Score + Insights).

## Core Requirements
1. **Input Form (Frontend):** Collects idea name, target audience, problem being solved, proposed solution, and potential revenue model.
2. **API Endpoint (Backend):** Receives idea data, validates it, and communicates with the AI service.
3. **AI Integration Layer:** Formats the input into a precise prompt, sends it to the AI API, and parses the JSON response.
4. **Scoring Logic:** Extracts the 'Venture Score' and determines if it crosses the threshold to unlock the Contributor Ecosystem.
5. **Storage:** Saves the evaluation report to MongoDB attached to the User ID.

## Relevant APIs (Planned)
- `POST /api/v1/ideas` - Submit a new idea for evaluation.
- `GET /api/v1/ideas/:id` - Retrieve a specific evaluation report.
- `GET /api/v1/ideas` - List all ideas submitted by the authenticated user.

## Edge Cases & Error Handling
- **AI API Failure/Timeout:** Inform the user gracefully, save the idea as "Pending Evaluation", and implement a retry mechanism.
- **Malformed AI Response:** If the AI does not return strict JSON, the backend must catch the error and retry or mark as failed.
- **Rate Limiting:** Ensure users cannot spam the evaluation endpoint (e.g., max 3 ideas per day per free user).
- **Inappropriate Content:** Need to instruct the AI to flag or reject inappropriate/illegal startup ideas before full evaluation.
