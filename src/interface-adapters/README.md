Here, we have interfaces to our business logic through orchestration calls of a certain business use cases and making data validation. Can also call some services, but never - repositories.
Our application knows only the interfaces, but the implementation is actually outside of the core business logic.
This allows to have even more decoupling between core business module and infrastructure tools.
Read more in [Ports & Adapters Architecture](https://medium.com/the-software-architecture-chronicles/ports-adapters-architecture-d19f2d476eca)