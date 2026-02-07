# Code Generation Rules

## When Creating New Service

1. Create domain entity in `domain` package (e.g., `User`, `UserProfile`, `Interest`)
2. Create repository interface extending appropriate base repository
   - **Naming**: `{Domain}Repository` (e.g., `UserRepository`, `UserProfileRepository`, `InterestRepository`)
3. Create DTOs (Request/Response) in `dto` package
   - **General DTO**: `{Domain}DTO` (e.g., `UserDTO`, `InterestDTO`, `UserProfileDTO`)
   - **Request DTO**: `Update{Domain}{Field}Req` or `{Action}{Domain}{Field}Req` (e.g., `UpdateBioProfileReq`, `ChangeCoverByUrlReq`, `UserProfileCreationReq`)
   - **Response DTO**: `{Domain}Response` or `Update{Domain}{Field}Res` (e.g., `UserProfileResponse`, `UserResponse`, `FileResponse`)
   - All DTOs must implement `Serializable` with `serialVersionUID = 1L`
   - Request DTOs must have `toEntity()` method using `BeanUtils.copyProperties`
   - Response DTOs must have static factory method using `BeanUtils.copyProperties`
4. Create service class with `@Service`, `@RequiredArgsConstructor`, and `@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)`
   - **Naming**: `{Domain}Service` (e.g., `UserService`, `UserProfileService`, `InterestService`)
5. Write methods will inherit transaction settings from class-level annotation (no need to add `@Transactional` to write methods)
6. Add `@Transactional(readOnly = true)` to each read method
7. Create controller with `@RestController`
8. Add exception handling in `ExceptionTranslator`
9. Add security configuration if needed

## When Creating New gRPC Service

1. Define proto file in `common/src/main/proto`
2. Generate Java classes (auto-generated)
3. Create mapper class with singleton pattern
   - Use `getInstance()` method with single instance
   - Use manual mapping, BeanUtils.copyProperties, or Lombok Builder
   - **DO NOT use MapStruct**
4. Create gRPC service implementation
5. Register in application configuration

## When Creating New GraphQL Resolver

1. Define GraphQL schema in `.graphqls` file
2. Create resolver class with `@DgsComponent`
3. Use reactive `Mono` for async operations
4. Use `Schedulers.boundedElastic()` for blocking calls
5. Create mapper for gRPC to DTO conversion
   - Use singleton pattern with `getInstance()`
   - Use manual mapping, BeanUtils.copyProperties, or Lombok Builder
   - **DO NOT use MapStruct**
