The entry point from our UI app or any other CLI tool to execute business use case - it's done through adapters, a concept from hexagonal architecture. Read more in [Ports & Adapters Architecture](https://medium.com/the-software-architecture-chronicles/ports-adapters-architecture-d19f2d476eca).

Controllers here are serving adapters purpose.

Here, we have interfaces to our business logic through orchestration controller calls of a certain business use cases and making data validation. Can also call some services, but never - repositories.