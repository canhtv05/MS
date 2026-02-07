# Security Patterns

## Authentication Check

```java
String username = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
  new ApiException(ErrorMessage.UNAUTHENTICATED)
);
```

## Authorization Check

```java
if (SecurityUtils.isGlobalUser()) {
    // Admin-only logic
}
```
