# File Upload Patterns

## MultipartFile Handling

```java
public FileResponse upload(MultipartFile[] files, ResourceType resourceType) {
  String userId = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
    new ApiException(ErrorMessage.UNAUTHENTICATED)
  );

  // Process files
  for (MultipartFile file : files) {
    // Validate content type
    // Process upload
  }

  return saveFileMetadata(userId, files);
}
```
