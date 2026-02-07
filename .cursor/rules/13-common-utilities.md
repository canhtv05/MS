# Common Utilities

## Validation

- Use Jakarta Validation annotations: `@NotBlank`, `@NotNull`, `@Email`, etc.
- Validate in service layer before processing

## Date/Time Handling

- Use `Instant` for timestamps
- Use `InstantToStringSerializer` for JSON serialization
- Use `DateUtils` from `com.leaf.common.utils` for date formatting

## Common Utils

- `CommonUtils.isEmpty()` for null/empty checks
- `CommonUtils.isNotEmpty()` for non-empty checks
- `JsonF` for JSON operations
