# Hướng Dẫn Sử Dụng .cursorrules

## Tổng Quan

File `.cursorrules` chứa các quy tắc và patterns cho Cursor AI để hiểu và generate code phù hợp với codebase của dự án MS (Microservices).

## Cấu Trúc Dự Án

Dự án MS là một hệ thống microservices sử dụng Spring Boot với các module:

- **auth**: Service xác thực và phân quyền (JPA/PostgreSQL)
- **profile**: Service quản lý profile người dùng (Neo4j)
- **file**: Service quản lý file (MongoDB)
- **notification**: Service gửi email thông báo
- **graphql-bff**: GraphQL BFF layer (Netflix DGS)
- **common**: Code dùng chung và gRPC definitions
- **gateway**: API Gateway

## Cách Sử Dụng

### 1. Khi Tạo Service Mới

Cursor sẽ tự động áp dụng các patterns:

```java
// Cursor sẽ generate code theo pattern này
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NewService {

  NewRepository repository;

  @Transactional
  public NewDTO create(NewCreationReq req) {
    // Implementation
  }
}
```

### 2. Khi Tạo Controller

```java
// Cursor sẽ generate theo REST controller pattern
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NewController {

  NewService service;

  @GetMapping("/new")
  public ResponseEntity<ResponseObject<NewDTO>> getNew() {
    return ResponseEntity.ok(ResponseObject.success(service.getNew()));
  }
}
```

### 3. Khi Tạo DTO

```java
// Cursor sẽ generate DTO với đầy đủ annotations
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NewResponse {

  String id;
  String name;

  public static NewResponse toNewResponse(New entity) {
    return NewResponse.builder().id(entity.getId()).name(entity.getName()).build();
  }
}
```

## Các Patterns Chính

### Service Layer

- ✅ Sử dụng `@RequiredArgsConstructor` cho dependency injection
- ✅ Sử dụng `@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)` cho immutable fields
- ✅ `@Transactional` cho write operations
- ✅ `@Transactional(readOnly = true)` cho read operations
- ✅ Exception handling với `ApiException` và `ErrorMessage`

### Controller Layer

- ✅ Return `ResponseEntity<ResponseObject<T>>`
- ✅ Sử dụng `ResponseObject.success()` helper
- ✅ Không đặt `@Transactional` ở controller

### DTO Patterns

- ✅ Static factory methods cho entity conversion
- ✅ `@JsonInclude(JsonInclude.Include.NON_NULL)` để loại bỏ null values
- ✅ Builder pattern với Lombok

### Repository Patterns

- **JPA**: `extends JpaRepository<Entity, ID>`
- **Neo4j**: `extends Neo4jRepository<Entity, String>`
- **MongoDB**: `extends MongoRepository<Entity, String>`

### gRPC Patterns

- ✅ Singleton mapper pattern
- ✅ `@GrpcService` annotation
- ✅ Proper StreamObserver handling

### GraphQL Patterns

- ✅ Reactive programming với `Mono`
- ✅ `@DgsComponent` và `@DgsQuery`
- ✅ Sử dụng `Schedulers.boundedElastic()` cho blocking calls

## Ví Dụ Thực Tế

### Tạo Service Mới

**Prompt cho Cursor:**

```
Tạo UserInterestService với method:
- createUserInterest(UserInterestCreationReq req)
- getUserInterests(String userId)
- deleteUserInterest(String id)
```

**Cursor sẽ generate:**

```java
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserInterestService {

  UserInterestRepository repository;
  InterestRepository interestRepository;

  @Transactional
  public UserInterestDTO createUserInterest(UserInterestCreationReq req) {
    String userId = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
      new ApiException(ErrorMessage.UNAUTHENTICATED)
    );

    Interest interest = interestRepository
      .findById(req.getInterestId())
      .orElseThrow(() -> new ApiException(ErrorMessage.INTEREST_NOT_FOUND));

    UserInterest userInterest = UserInterest.builder()
      .userId(userId)
      .interestId(interest.getId())
      .build();

    return UserInterestDTO.toUserInterestDTO(repository.save(userInterest));
  }

  @Transactional(readOnly = true)
  public List<UserInterestDTO> getUserInterests(String userId) {
    return repository
      .findByUserId(userId)
      .stream()
      .map(UserInterestDTO::toUserInterestDTO)
      .toList();
  }

  @Transactional
  public void deleteUserInterest(String id) {
    String userId = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
      new ApiException(ErrorMessage.UNAUTHENTICATED)
    );

    UserInterest userInterest = repository
      .findById(id)
      .orElseThrow(() -> new ApiException(ErrorMessage.USER_INTEREST_NOT_FOUND));

    if (!userInterest.getUserId().equals(userId)) {
      throw new ApiException(ErrorMessage.FORBIDDEN);
    }

    repository.delete(userInterest);
  }
}
```

### Tạo Controller Mới

**Prompt cho Cursor:**

```
Tạo UserInterestController với các endpoints:
- GET /user-interests - lấy danh sách interests của user hiện tại
- POST /user-interests - tạo user interest mới
- DELETE /user-interests/{id} - xóa user interest
```

**Cursor sẽ generate:**

```java
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserInterestController {

  UserInterestService service;

  @GetMapping("/user-interests")
  public ResponseEntity<ResponseObject<List<UserInterestDTO>>> getUserInterests() {
    String userId = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
      new ApiException(ErrorMessage.UNAUTHENTICATED)
    );
    return ResponseEntity.ok(ResponseObject.success(service.getUserInterests(userId)));
  }

  @PostMapping("/user-interests")
  public ResponseEntity<ResponseObject<UserInterestDTO>> createUserInterest(
    @RequestBody UserInterestCreationReq req
  ) {
    return ResponseEntity.ok(ResponseObject.success(service.createUserInterest(req)));
  }

  @DeleteMapping("/user-interests/{id}")
  public ResponseEntity<ResponseObject<Void>> deleteUserInterest(@PathVariable String id) {
    service.deleteUserInterest(id);
    return ResponseEntity.ok(ResponseObject.success());
  }
}
```

## Best Practices

### 1. Luôn Validate Input

```java
if (StringUtils.isBlank(req.getName())) {
    throw new ApiException(ErrorMessage.VALIDATION_ERROR);
}
```

### 2. Sử dụng Optional Properly

```java
User user = userRepository
  .findById(id)
  .orElseThrow(() -> new ApiException(ErrorMessage.USER_NOT_FOUND));
```

### 3. Logging với Context

```java
log.error("Failed to create user profile for userId: {}", userId, e);
```

### 4. Cache Management

```java
String cacheKey = CacheKey.USER_PROFILE.name() + ":" + username;
redisService.evict(cacheKey);
```

## Anti-Patterns

❌ **KHÔNG làm:**

- Đặt `@Transactional` ở controller
- Catch exception mà không log
- Hardcode error messages
- Expose entity classes trực tiếp
- Sử dụng blocking operations trong GraphQL resolvers

✅ **NÊN làm:**

- Sử dụng DTOs cho tất cả API responses
- Sử dụng `ErrorMessage` enum cho error handling
- Sử dụng `SecurityUtils` cho authentication
- Sử dụng reactive programming trong GraphQL

## Module-Specific Guidelines

### auth module

- Sử dụng JPA Specifications cho dynamic queries
- Sử dụng `JpaSpecificationExecutor` cho complex searches

### profile module

- Sử dụng Cypher queries cho graph operations
- Return DTOs trực tiếp từ queries khi có thể

### file module

- Validate file size và content type
- Sử dụng Cloudinary cho file storage
- Handle async file processing

### notification module

- Sử dụng Kafka events
- Handle email sending errors gracefully

### graphql-bff module

- Luôn sử dụng `Mono` cho async operations
- Sử dụng `Schedulers.boundedElastic()` cho blocking calls
- Aggregate data từ multiple services

## Troubleshooting

### Cursor không follow patterns?

1. Đảm bảo file `.cursorrules` ở root directory
2. Restart Cursor IDE
3. Reference file trong prompt: "Theo pattern trong .cursorrules, tạo..."

### Code không match với existing code?

1. Check existing similar files trong module
2. Reference specific file: "Theo pattern của UserService, tạo..."
3. Ask Cursor to review existing code first

## Tips

1. **Reference existing code**: "Theo pattern của UserService.java, tạo..."
2. **Be specific**: "Tạo service với @Transactional và exception handling"
3. **Ask for review**: "Review code này có đúng với patterns không?"
4. **Iterate**: Generate code, review, refine

## Liên Kết

- [Transactional Guide](./TRANSACTIONAL_GUIDE.md) - Hướng dẫn về @Transactional
- [Code Style Guide](./CODE_STYLE.md) - Coding standards
- [Git Commit Setup](./GIT_COMMIT_SETUP.md) - Git conventions
