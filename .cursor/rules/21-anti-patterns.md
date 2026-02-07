# Anti-Patterns to Avoid

1. ❌ Don't use `@Transactional` on controllers
2. ❌ Don't use `@Transactional` on private methods
3. ❌ Don't create DTOs without implementing `Serializable` and `serialVersionUID`
4. ❌ Don't use MapStruct for mapping (use manual mapping, BeanUtils.copyProperties, or Lombok Builder)
5. ❌ Don't create mappers without singleton pattern (must use `getInstance()` with single instance)
6. ❌ Don't forget to add `@Transactional(readOnly = true)` to read service methods
7. ❌ Don't add `@Transactional` to DTOs (DTOs are data transfer objects, not service classes)
8. ❌ Don't catch and swallow exceptions without logging
9. ❌ Don't use `null` checks when `Optional` is available
10. ❌ Don't hardcode error messages (use `ErrorMessage` enum)
11. ❌ Don't mix database technologies in same service
12. ❌ Don't expose entity classes directly (always use DTOs)
13. ❌ Don't use blocking operations in GraphQL resolvers without `Schedulers`
14. ❌ Don't use `@FieldDefaults` annotation (use `private final` explicitly)
