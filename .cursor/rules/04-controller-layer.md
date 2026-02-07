# Controller Layer Patterns

## REST Controller Structure

```java
@RestController
@RequiredArgsConstructor
public class UserController {

  private final UserService service;

  @GetMapping("/users")
  public ResponseEntity<ResponseObject<UserDTO>> getUser() {
    return ResponseEntity.ok(ResponseObject.success(service.getUser()));
  }

  @PostMapping("/users")
  public ResponseEntity<ResponseObject<UserDTO>> createUser(
    @RequestBody UserProfileCreationReq req
  ) {
    return ResponseEntity.ok(ResponseObject.success(service.createUser(req)));
  }
}
```

## Response Format

- Always return `ResponseEntity<ResponseObject<T>>`
- Use `ResponseObject.success(data)` for success responses
- Use `ResponseObject.success(data, pageResponse)` for paginated responses
- Use `ResponseObject.error(ErrorMessage.XXX)` for error responses
