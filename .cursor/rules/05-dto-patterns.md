# DTO Patterns

## DTO Requirements

- **All DTOs must implement `Serializable`**
- **All DTOs must have `private static final long serialVersionUID = 1L;`**
- **Request DTOs must have `toEntity()` method using `BeanUtils.copyProperties`**
- **Response DTOs must have static factory method using `BeanUtils.copyProperties`**

## Response DTO Structure

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponse implements Serializable {

  private static final long serialVersionUID = 1L;

  private String id;
  private String userId;
  private String fullname;

  // Static factory method for entity conversion using BeanUtils
  public static UserProfileResponse toUserProfileResponse(UserProfile entity) {
    UserProfileResponse response = new UserProfileResponse();
    org.springframework.beans.BeanUtils.copyProperties(entity, response);
    return response;
  }
}
```

**Naming**: Response DTO follows pattern `{Domain}Response` (e.g., `UserProfileResponse`, `UserResponse`, `FileResponse`)

## Request DTO Structure

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateBioProfileReq implements Serializable {

  private static final long serialVersionUID = 1L;

  @NotBlank
  private String bio;

  // Convert to entity using BeanUtils
  public UserProfile toEntity() {
    UserProfile entity = new UserProfile();
    org.springframework.beans.BeanUtils.copyProperties(this, entity);
    return entity;
  }
}
```

**Naming**: Request DTO follows pattern `Update{Domain}{Field}Req` or `{Action}{Domain}{Field}Req` (e.g., `UpdateBioProfileReq`, `ChangeCoverByUrlReq`, `UserProfileCreationReq`)

## Search Request/Response

- Use `SearchRequest` record from `com.leaf.common.dto.search`
- Use `SearchResponse<T>` from `com.leaf.common.dto.search`
- Convert to `Pageable` using `searchRequest.toPageable()`
- Build `PageResponse` from Spring `Page` object:

```java
PageResponse pageResponse = PageResponse.builder()
    .currentPage(page.getNumber() + 1)
    .size(page.getSize())
    .total(page.getTotalElements())
    .totalPages(page.getTotalPages())
    .count(page.getContent().size())
    .build();
return new SearchResponse<>(content, pageResponse);
```
