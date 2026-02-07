# Naming Conventions & Package Structure

## Naming Conventions

### Domain Entity Naming

- Use PascalCase: `User`, `UserProfile`, `Interest`, `File`

### DTO Naming

- **General DTO**: `{Domain}DTO` (e.g., `UserDTO`, `InterestDTO`, `UserProfileDTO`)
- **Request DTO**: `Update{Domain}{Field}Req` or `{Action}{Domain}{Field}Req` (e.g., `UpdateBioProfileReq`, `ChangeCoverByUrlReq`, `UserProfileCreationReq`)
- **Response DTO**: `{Domain}Response` or `Update{Domain}{Field}Res` (e.g., `UserProfileResponse`, `UserResponse`, `FileResponse`)

### Service Naming

- **Service**: `{Domain}Service` (e.g., `UserService`, `UserProfileService`, `InterestService`, `FileService`)

### Repository Naming

- **Repository**: `{Domain}Repository` (e.g., `UserRepository`, `UserProfileRepository`, `InterestRepository`, `FileRepository`)

## Package Structure

- Follow the pattern: `com.leaf.{module}.{layer}`
- Layers: `controller`, `service`, `repository`, `domain`, `dto`, `grpc`, `config`, `security`, `exception`
- DTOs should be in subpackages: `dto.req`, `dto.res`, `dto.search`, `dto.excel` when applicable
