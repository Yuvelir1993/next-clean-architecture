# DTOs (Data Transfer Objects)

> **BFF (Backend-for-Frontend) mappers** - shape data specifically for a given mobile/web UI while keeping core DTOs clean.

Here are DTOs for all business-level aggregates, entities and value objects passed to UI.
The value of it is changing anything in the business model will not propagate this change to all UI components where it's used (such errors sometimes is extremely tricky to catch and very easy to overlook!)
It also reduces the potentially leaked business logic into UI which can bring complexity, performance and even security issues.
