# Adapters

> In Hexagonal (Ports-and-Adapters) architecture we distinguish adapters by the direction in which they interact with the application core (business/use-cases). Anything that triggers a use-case belongs on the **driving side**; anything that the core uses to accomplish work belongs on the **driven side**.

*Read more in [Ports & Adapters Architecture](https://medium.com/the-software-architecture-chronicles/ports-adapters-architecture-d19f2d476eca).*

## Controllers (driving side)

> Converts any outside-world event into an application action.

**Can never call infrastructure/repositories**.
***Reason:*** **Controllers** sit on the outer-most “driving-adapter” ring; **repositories** sit on a different outer ring – the “driven-adapter” (infrastructure) ring. Both rings depend on the application-core, but **must never depend on each other**.

## Infrastructure (driven side)

> Representing the part of the outside world which can serve an application needs.

## How to decide if something should be its own adapter

    1. Different technology boundary? (e.g., HTTP vs. AMQP vs. SQL) → yes, separate adapter.
    2. Swappable without touching business code? If you might replace just that bit (e.g., migrate from PostgreSQL to DynamoDB) an adapter boundary keeps the blast-radius small.
    3. Independent deployment/runtime? Things that run in a worker pod, a lambda, or another process often need their own adapter.

Keep each adapter thin and mechanical: translate, delegate, transform—nothing more. All the real decisions stay in the application core behind the ports. That’s the essence of Hexagonal architecture.
