# Contributing to MS Project

Thank you for your interest in contributing to the MS project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

Please be respectful and constructive in all interactions with the project community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/canhtv05/MS.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes following our [commit message guidelines](#commit-message-guidelines)
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Setup

### Prerequisites

- **Java**: JDK 21
- **Node.js**: v18+ and npm
- **Maven**: 3.8+
- **Docker**: For running databases and services

### Initial Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Setup Git hooks**:

   ```bash
   npm run prepare
   ```

   This will install Husky hooks for commit linting and pre-commit checks.

3. **Build Java services**:
   ```bash
   cd auth  # or any other service
   mvn clean install
   ```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to **more readable messages** that are easy to follow when looking through the **project history**.

### Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope

The scope should be the name of the service or module affected:

- **auth**: Authentication service
- **profile**: Profile service
- **gateway**: API Gateway
- **notification**: Notification service
- **file**: File service
- **common**: Common/shared code
- **web-client**: Frontend application

### Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end

### Examples

```bash
feat(auth): add JWT token refresh endpoint
fix(profile): resolve Neo4j connection issue
docs(readme): update installation instructions
style(web-client): format code with prettier
refactor(gateway): simplify encryption middleware
test(notification): add email service unit tests
```

### Using Commitizen

For an interactive commit experience, use:

```bash
npm run commit
```

This will guide you through creating a properly formatted commit message.

## Code Style Guidelines

### Java Code Style

- **Indentation**: 4 spaces (no tabs)
- **Line length**: Maximum 120 characters
- **Naming conventions**:
  - Classes: `PascalCase`
  - Methods/Variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Packages: `lowercase`

#### Formatting Java Code

We use **Spotless** for automatic Java code formatting:

```bash
# Check formatting
mvn spotless:check

# Apply formatting
mvn spotless:apply
```

#### Checking Code Style

We use **Checkstyle** to enforce code style rules:

```bash
mvn checkstyle:check
```

### JavaScript/TypeScript Code Style

- **Indentation**: 2 spaces (no tabs)
- **Line length**: Maximum 100 characters
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Trailing commas**: Always

#### Formatting JS/TS Code

We use **Prettier** and **ESLint**:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### CSS/SCSS Code Style

- **Indentation**: 2 spaces
- We use **Stylelint** for CSS/SCSS linting

## Pre-commit Hooks

We use **Husky** and **lint-staged** to automatically check and format code before commits:

- **JavaScript/TypeScript/CSS**: Automatically formatted with Prettier and linted with ESLint
- **Java**: You'll be notified to run `mvn spotless:apply` if Java files are changed
- **Commit messages**: Automatically validated against Conventional Commits format

If the pre-commit hook fails, fix the issues and try committing again.

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Add tests for new features
4. Ensure all tests pass
5. Update the CHANGELOG.md if applicable
6. Request review from maintainers

### PR Title Format

PR titles should follow the same format as commit messages:

```
feat(auth): add OAuth2 support
```

## Questions?

If you have questions, please open an issue or reach out to the maintainers.

---

Thank you for contributing! 🎉
