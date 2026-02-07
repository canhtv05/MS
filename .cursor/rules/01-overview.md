# Project Overview

This is a microservices-based Spring Boot application with the following modules:

- **auth**: Authentication and authorization service (JPA/PostgreSQL)
- **profile**: User profile service (Neo4j)
- **file**: File upload and management service (MongoDB)
- **notification**: Email notification service
- **graphql-bff**: GraphQL BFF layer using Netflix DGS
- **common**: Shared common code and gRPC definitions
- **gateway**: API Gateway
