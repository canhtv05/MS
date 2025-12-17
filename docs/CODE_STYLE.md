# Code Style Guide

This document defines the code style standards for the MS project.

## Table of Contents

- [Java Code Style](#java-code-style)
- [JavaScript/TypeScript Code Style](#javascripttypescript-code-style)
- [CSS/SCSS Code Style](#cssscss-code-style)
- [General Best Practices](#general-best-practices)

## Java Code Style

### Indentation and Formatting

- **Indentation**: 4 spaces (no tabs)
- **Line length**: Maximum 120 characters
- **Braces**: Opening brace on same line, closing brace on new line
- **Blank lines**: One blank line between methods, two blank lines between classes

#### Example

```java
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User findById(Long id) {
    return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
  }
}
```

### Naming Conventions

| Element     | Convention                            | Example                              |
| ----------- | ------------------------------------- | ------------------------------------ |
| Classes     | PascalCase                            | `UserService`, `AuthController`      |
| Interfaces  | PascalCase with 'I' prefix (optional) | `UserRepository`, `IEmailService`    |
| Methods     | camelCase                             | `findById()`, `authenticateUser()`   |
| Variables   | camelCase                             | `userId`, `emailAddress`             |
| Constants   | UPPER_SNAKE_CASE                      | `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT` |
| Packages    | lowercase                             | `com.leaf.auth.service`              |
| Enums       | PascalCase                            | `UserRole`, `OrderStatus`            |
| Enum values | UPPER_SNAKE_CASE                      | `ROLE_ADMIN`, `STATUS_PENDING`       |

### Import Organization

1. Java standard library imports
2. Third-party library imports
3. Project imports
4. Static imports

Separate each group with a blank line.

```java
import static com.leaf.common.Constants.DEFAULT_PAGE_SIZE;

import com.leaf.auth.domain.User;
import com.leaf.auth.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
```

### Annotations

- Place annotations on separate lines
- Order: Framework annotations, then custom annotations

```java
@Service
@Transactional
@Slf4j
public class UserService {
  // ...
}
```

### Comments and Documentation

- Use JavaDoc for public APIs
- Use inline comments sparingly, prefer self-documenting code
- Keep comments up-to-date with code changes

```java
/**
 * Authenticates a user with the provided credentials.
 *
 * @param username the username
 * @param password the password
 * @return the authenticated user
 * @throws AuthenticationException if authentication fails
 */
public User authenticate(String username, String password) {
  // Implementation
}
```

### Exception Handling

- Catch specific exceptions, not generic `Exception`
- Don't swallow exceptions
- Use custom exceptions for business logic errors

```java
// Good
try {
    processPayment(order);
} catch (PaymentException e) {
    log.error("Payment failed for order {}", order.getId(), e);
    throw new OrderProcessingException("Payment failed", e);
}

// Bad
try {
    processPayment(order);
} catch (Exception e) {
    // Silent failure
}
```

### Tools

- **Checkstyle**: Enforces code style rules
- **Spotless**: Automatic code formatting with Google Java Format (AOSP style)

```bash
# Check style
mvn checkstyle:check

# Format code
mvn spotless:apply
```

## JavaScript/TypeScript Code Style

### Indentation and Formatting

- **Indentation**: 2 spaces (no tabs)
- **Line length**: Maximum 100 characters
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Trailing commas**: Always use trailing commas in multi-line objects/arrays

#### Example

```typescript
const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  roles: ['admin', 'user'],
};

function authenticateUser(username: string, password: string): Promise<User> {
  return authService.authenticate(username, password);
}
```

### Naming Conventions

| Element            | Convention                  | Example                             |
| ------------------ | --------------------------- | ----------------------------------- |
| Classes            | PascalCase                  | `UserService`, `AuthController`     |
| Interfaces/Types   | PascalCase                  | `User`, `AuthResponse`              |
| Functions          | camelCase                   | `authenticateUser()`, `fetchData()` |
| Variables          | camelCase                   | `userId`, `isAuthenticated`         |
| Constants          | UPPER_SNAKE_CASE            | `API_BASE_URL`, `MAX_RETRIES`       |
| Components (React) | PascalCase                  | `UserProfile`, `LoginForm`          |
| Hooks (React)      | camelCase with 'use' prefix | `useAuth()`, `useUserData()`        |

### TypeScript Specific

- Always define types for function parameters and return values
- Use interfaces for object shapes
- Use type aliases for unions and complex types
- Avoid `any` type, use `unknown` if type is truly unknown

```typescript
// Good
interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): Promise<User> {
  return api.get(`/users/${id}`);
}

// Bad
function getUser(id): Promise<any> {
  return api.get(`/users/${id}`);
}
```

### React/JSX Specific

- One component per file
- Use functional components with hooks
- Props should be typed with interfaces
- Use destructuring for props

```typescript
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user)}>Edit</button>
    </div>
  );
};
```

### Import Organization

1. React and third-party libraries
2. Internal components and utilities
3. Types and interfaces
4. Styles

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserCard } from '@/components/UserCard';
import { useAuth } from '@/hooks/useAuth';

import type { User } from '@/types';

import './UserList.css';
```

### Tools

- **ESLint**: Linting
- **Prettier**: Code formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## CSS/SCSS Code Style

### Indentation and Formatting

- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Property order**: Alphabetical or grouped by type

#### Example

```css
.user-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.user-card__title {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}
```

### Naming Conventions

- Use BEM (Block Element Modifier) methodology
- Use kebab-case for class names
- Be descriptive and semantic

```css
/* Block */
.user-profile {
}

/* Element */
.user-profile__avatar {
}
.user-profile__name {
}

/* Modifier */
.user-profile--compact {
}
.user-profile__avatar--large {
}
```

### SCSS Specific

- Nest selectors max 3 levels deep
- Use variables for colors, spacing, and breakpoints
- Use mixins for reusable patterns

```scss
$primary-color: #007bff;
$spacing-unit: 8px;

.user-card {
  padding: $spacing-unit * 2;
  background-color: $primary-color;

  &__title {
    font-size: 18px;
    margin-bottom: $spacing-unit;
  }

  &--compact {
    padding: $spacing-unit;
  }
}
```

### Tools

- **Stylelint**: CSS/SCSS linting

## General Best Practices

### Version Control

- Commit often with meaningful messages
- Follow [Conventional Commits](https://www.conventionalcommits.org/)
- Keep commits focused on a single change
- Review your changes before committing

### Code Review

- Keep PRs small and focused
- Write descriptive PR descriptions
- Respond to review comments promptly
- Be respectful and constructive in reviews

### Testing

- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

```java
@Test
void shouldAuthenticateUserWithValidCredentials() {
  // Arrange
  String username = "testuser";
  String password = "password123";
  User expectedUser = new User(username);

  // Act
  User actualUser = authService.authenticate(username, password);

  // Assert
  assertEquals(expectedUser, actualUser);
}
```

### Documentation

- Keep README.md up-to-date
- Document complex algorithms and business logic
- Use clear and concise language
- Include examples where helpful

---

**Remember**: Consistency is key. When in doubt, follow the existing code style in the project.
