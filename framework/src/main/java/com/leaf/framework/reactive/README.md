# Reactive Services Package

This package contains reactive versions of blocking services for use in reactive contexts (e.g., Spring Cloud Gateway).

## Structure

- `cache/ReactiveRedisCacheService` - Reactive version of RedisCacheService
- `service/ReactiveKeyCacheService` - Reactive version of KeyCacheService
- `util/ReactiveJwtUtil` - Reactive version of JwtUtil

## Usage

### For Reactive Applications (Spring Cloud Gateway)

Use services from `com.leaf.framework.reactive.*`:

- `ReactiveJwtUtil` - Returns `Mono<TokenStatus>`
- `ReactiveRedisCacheService` - Returns `Mono<V>` for get operations
- `ReactiveKeyCacheService` - Returns `Mono<String>` for key generation

### For Blocking Applications (Spring MVC)

Use services from `com.leaf.framework.*`:

- `JwtUtil` - Returns `TokenStatus` directly
- `RedisCacheService` - Returns `V` directly
- `KeyCacheService` - Returns `String` directly

## Implementation Details

Reactive services wrap blocking operations using:

- `Mono.fromCallable()` - For blocking operations
- `Schedulers.boundedElastic()` - To run blocking operations on a separate thread pool

This ensures that blocking operations don't block the reactive event loop.
