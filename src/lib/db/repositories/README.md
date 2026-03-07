# Repositories

This directory will contain data repository implementations.

Repositories are responsible for the direct interaction with the data source (e.g., a database like PostgreSQL via Data Connect, or a Firestore collection). Their primary job is to execute CRUD (Create, Read, Update, Delete) operations.

## Responsibilities
- Abstract the data source from the rest of the application.
- Provide a clear, typed API for data access.
- Handle data transformation between the application's data model and the database schema if necessary.

## Example
`conversation.repository.ts` would contain functions like `findConversationById`, `listConversations`, `createConversation`, etc.
