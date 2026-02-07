# Testing Patterns

## Unit Test Structure

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  UserRepository repository;

  @InjectMocks
  UserService service;

  @Test
  void shouldCreateUser() {
    // Given
    // When
    // Then
  }
}
```
