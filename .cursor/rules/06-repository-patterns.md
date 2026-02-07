# Repository Patterns

## JPA Repository (PostgreSQL - auth module)

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
  Optional<User> findByUsername(String username);

  // Custom query methods
  @Query("SELECT u FROM User u WHERE u.email = :email")
  Optional<User> findByEmail(@Param("email") String email);
}
```

**Naming**: Repository interface follows pattern `{Domain}Repository` (e.g., `UserRepository`, `UserProfileRepository`, `InterestRepository`)

## Neo4j Repository (profile module)

```java
@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
  Optional<UserProfile> findByUserId(String userId);

  @Query("MATCH (up:UserProfile {field: $field}) RETURN up")
  Optional<UserProfile> findCustom(@Param("field") String field);
}
```

**Naming**: Repository interface follows pattern `{Domain}Repository` (e.g., `UserRepository`, `UserProfileRepository`, `InterestRepository`)

## MongoDB Repository (file module)

```java
@Repository
public interface FileRepository extends MongoRepository<File, String> {
  List<File> findByOwnerId(String ownerId);
}
```

**Naming**: Repository interface follows pattern `{Domain}Repository` (e.g., `UserRepository`, `UserProfileRepository`, `FileRepository`)
