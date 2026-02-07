# Best Practices

1. **Always validate input** in service layer before processing
2. **Use Optional** for nullable returns from repositories
3. **Use static factory methods with BeanUtils.copyProperties** in Response DTOs for entity conversion
4. **Use toEntity() with BeanUtils.copyProperties** in Request DTOs for entity conversion
5. **All DTOs must implement Serializable** with `serialVersionUID = 1L`
6. **Always add @Transactional annotation** to read service methods: `@Transactional(readOnly = true)` (write methods inherit from class-level annotation)
7. **Use singleton pattern for mappers** - All mappers must use `getInstance()` with single instance
8. **Use manual mapping, BeanUtils.copyProperties, or Lombok Builder** for mapper implementations - **DO NOT use MapStruct**
9. **Log errors** with context using `log.error("message: {}", variable, exception)`
10. **Use constants** from `EventConstants` for Kafka topics
11. **Use enums** from `ErrorMessage` for error handling
12. **Cache keys** should use `CacheKey` enum
13. **Security checks** should be done early in service methods
14. **Transaction boundaries** should be clear and minimal
15. **Use reactive programming** in GraphQL resolvers for better performance
