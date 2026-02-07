# Module-Specific Notes

## auth module

- Uses JPA/PostgreSQL
- Handles authentication, authorization, user management
- Uses `JpaSpecificationExecutor` for dynamic queries

## profile module

- Uses Neo4j for graph database
- Handles user profiles, relationships, interests
- Uses Cypher queries for complex graph operations

## file module

- Uses MongoDB for file metadata
- Integrates with Cloudinary for file storage
- Handles images and videos

## notification module

- Handles email notifications
- Uses Kafka for event-driven architecture
- Integrates with email service

## graphql-bff module

- Uses Netflix DGS framework
- Aggregates data from multiple microservices via gRPC
- Uses reactive programming (Mono/Flux)

## common module

- Contains shared DTOs, exceptions, utilities
- Contains gRPC proto definitions
- Contains framework code
