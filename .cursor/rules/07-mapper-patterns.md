# Mapper Patterns

## General Mapper Rules

- **DO NOT use MapStruct** - Use manual mapping, BeanUtils.copyProperties, or Lombok Builder instead
- **All mappers must use singleton pattern** with a single instance
- **Mapper class naming**: `{Domain}Mapper` or `{Domain}GrpcMapper` (e.g., `UserProfileMapper`, `UserProfileGrpcMapper`)
- **Method naming**: `toXxx()` for conversion methods (e.g., `toUserProfileDTO()`, `toGrpcResponse()`)

## Mapper Implementation Options

1. **Manual mapping** - Direct field assignment using Lombok Builder or setters
2. **BeanUtils.copyProperties** - For simple field-to-field mapping
3. **Lombok Builder** - For complex mapping with transformations

## Mapper Singleton Pattern

```java
public class XxxMapper {

  private static final XxxMapper INSTANCE = new XxxMapper();

  private XxxMapper() {}

  public static XxxMapper getInstance() {
    return INSTANCE;
  }

  // Manual mapping example
  public XxxDTO toXxxDTO(XxxEntity entity) {
    if (entity == null) {
      return null;
    }
    return XxxDTO.builder().id(entity.getId()).name(entity.getName()).build();
  }

  // BeanUtils mapping example
  public XxxDTO toXxxDTO(XxxEntity entity) {
    if (entity == null) {
      return null;
    }
    XxxDTO dto = new XxxDTO();
    org.springframework.beans.BeanUtils.copyProperties(entity, dto);
    return dto;
  }
}
```
