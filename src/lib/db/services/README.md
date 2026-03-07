# Services

This directory will contain business logic services.

Services orchestrate the application's business logic. They use one or more repositories to fetch and manipulate data, enforce business rules, and perform complex operations that span multiple data models.

## Responsibilities
- Encapsulate business rules and logic.
- Coordinate data operations across multiple repositories.
- Trigger side effects (e.g., sending notifications, interacting with external APIs).
- Provide a high-level API for the application's use cases (e.g., to be called by API Routes or Server Actions).

## Example
`quote.service.ts` might have a function like `generateQuoteForLead`, which would:
1. Use `leadRepository` to find the lead.
2. Use `aiService` to get a price suggestion.
3. Use `quoteRepository` to create a new quote record.
4. Use `conversationRepository` to add a system message about the new quote.
