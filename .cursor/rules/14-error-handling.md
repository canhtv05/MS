# Error Handling

## Exception Translator

Each module should have an `ExceptionTranslator`:

```java
@RestControllerAdvice
public class ExceptionTranslator {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ResponseObject<Void>> handleApiException(ApiException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
      ResponseObject.error(ex.getErrorMessage())
    );
  }
}
```
