# Service Layer Patterns

## Service Class Structure

```java
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class UserService {

  // Dependencies injected via constructor (Lombok @RequiredArgsConstructor)
  private final UserRepository repository;
  private final OtherService otherService;

  // Write operations
  public UserDTO createUser(UserProfileCreationReq req) {
    // Implementation
  }

  // Read operations
  @Transactional(readOnly = true)
  public UserDTO getUser(Long id) {
    // Implementation
  }
}
```

**Naming**: Service class name follows pattern `{Domain}Service` (e.g., `UserService`, `UserProfileService`, `InterestService`)

## Transaction Management

- **Class-level**: Use `@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)` for services with write operations
  - Import: `import org.springframework.transaction.annotation.Propagation;`
  - Write operations will inherit transaction settings from class-level annotation
- **Write operations**: No need to add `@Transactional` annotation to write methods (inherit from class-level)
- **Read operations**: Always add `@Transactional(readOnly = true)` to each read method to override class-level settings
- **Propagation**: Use `REQUIRED` (default) for most cases

## Exception Handling

- Always use `ApiException` with `ErrorMessage` enum
- Pattern: `throw new ApiException(ErrorMessage.XXX)`
- Use `SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new ApiException(ErrorMessage.UNAUTHENTICATED))`
- Use `repository.findById(id).orElseThrow(() -> new ApiException(ErrorMessage.XXX_NOT_FOUND))`
