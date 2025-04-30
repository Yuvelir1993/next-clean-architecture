# Business logic

## Application

### Use Cases

> *Represents and application ports and defines all the interactions that a core will have with anything outside through infrastructure adapters.*

Pure business logic with domain entities, not polluted with any third-party dependencies implementation details.
The entry point is a **use-cases**. Each use case represents some business-relevant action. To realize this action it groups necessary services and repositories (infrastructure adapters) logics invocations.

## Domain

> Represents pure domain entities.
