# Git Commit Standards & Code Formatting Setup

This document explains how to use the Git commit standards and code formatting tools configured in this project.

## Overview

This project uses:

- **Commitlint**: Enforces conventional commit messages
- **Husky**: Git hooks for automation
- **Prettier**: Code formatting for JS/TS/CSS
- **ESLint**: Linting for JS/TS
- **Checkstyle**: Code style checking for Java
- **Spotless**: Code formatting for Java

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will automatically set up Husky hooks.

### 2. Make Changes

Edit your code as needed. The formatting tools will help you maintain consistent style.

### 3. Commit Your Changes

#### Option A: Interactive Commit (Recommended)

```bash
npm run commit
```

This will guide you through creating a properly formatted commit message.

#### Option B: Manual Commit

```bash
git add .
git commit -m "feat(auth): add JWT token refresh endpoint"
```

The commit message will be validated automatically. If it doesn't follow the conventional format, the commit will be rejected.

## Commit Message Format

### Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

### Scopes

- `auth`: Authentication service
- `profile`: Profile service
- `gateway`: API Gateway
- `notification`: Notification service
- `file`: File service
- `common`: Common/shared code
- `web-client`: Frontend application

### Examples

```bash
feat(auth): add password reset functionality
fix(profile): resolve Neo4j connection timeout
docs(readme): update installation instructions
style(web-client): format components with prettier
refactor(gateway): simplify encryption middleware
test(notification): add email service tests
chore(deps): update Spring Boot to 3.5.7
```

## Code Formatting

### JavaScript/TypeScript (Tab = 2 spaces)

#### Check Formatting

```bash
npm run lint
```

#### Auto-fix Formatting

```bash
npm run format
```

#### Configuration

- **Prettier**: `.prettierrc`
- **ESLint**: `eslint.config.js`
- **EditorConfig**: `.editorconfig`

### Java (Tab = 4 spaces)

#### Check Code Style

```bash
cd <service-name>  # e.g., cd auth
mvn checkstyle:check
```

#### Format Code

```bash
cd <service-name>
mvn spotless:apply
```

#### Check Formatting

```bash
cd <service-name>
mvn spotless:check
```

#### Configuration

- **Checkstyle**: `checkstyle.xml` (root directory)
- **Spotless**: Configured in each service's `pom.xml`
- **EditorConfig**: `.editorconfig`

### Adding Maven Plugins to Services

If you need to add the Checkstyle and Spotless plugins to a service's `pom.xml`, refer to `maven-plugins-template.xml` in the root directory.

Add the plugins inside the `<build><plugins>` section of your `pom.xml`.

## Pre-commit Hooks

When you commit, the following checks run automatically:

### For JavaScript/TypeScript/CSS Files

1. **ESLint**: Checks and auto-fixes linting issues
2. **Prettier**: Formats code automatically

### For Java Files

You'll see a message to run `mvn spotless:apply` if Java files are changed.

### For Commit Messages

The commit message is validated against the Conventional Commits format.

## Bypassing Hooks (Not Recommended)

If you absolutely need to bypass the hooks:

```bash
git commit --no-verify -m "your message"
```

**Warning**: This should only be used in exceptional circumstances.

## Troubleshooting

### Commit Rejected: Invalid Commit Message

**Problem**: Your commit message doesn't follow the conventional format.

**Solution**: Use `npm run commit` for an interactive commit, or format your message correctly:

```bash
git commit -m "feat(scope): description"
```

### Pre-commit Hook Fails

**Problem**: Code doesn't pass linting or formatting checks.

**Solution**:

For JS/TS:

```bash
npm run lint
npm run format
git add .
git commit -m "your message"
```

For Java:

```bash
cd <service-name>
mvn spotless:apply
git add .
git commit -m "your message"
```

### Husky Hooks Not Working

**Problem**: Hooks aren't running when you commit.

**Solution**: Reinstall Husky:

```bash
npm run prepare
```

## IDE Integration

### Visual Studio Code

Install these extensions:

- **Prettier - Code formatter**
- **ESLint**
- **EditorConfig for VS Code**
- **Checkstyle for Java**

### IntelliJ IDEA

1. Enable EditorConfig support: `Settings > Editor > Code Style > Enable EditorConfig support`
2. Install Checkstyle plugin: `Settings > Plugins > Checkstyle-IDEA`
3. Configure Checkstyle: `Settings > Tools > Checkstyle > Add checkstyle.xml`

## Scripts Reference

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `npm run lint`         | Lint JS/TS files                           |
| `npm run format`       | Format JS/TS/CSS files                     |
| `npm run commit`       | Interactive commit with Commitizen         |
| `npm run release`      | Create a new release with standard-version |
| `mvn checkstyle:check` | Check Java code style                      |
| `mvn spotless:check`   | Check Java code formatting                 |
| `mvn spotless:apply`   | Format Java code                           |

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Checkstyle Documentation](https://checkstyle.org/)
- [Spotless Documentation](https://github.com/diffplug/spotless)

---

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/CODE_STYLE.md](docs/CODE_STYLE.md).
