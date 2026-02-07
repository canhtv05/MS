# Caching Patterns

## Redis Cache Eviction

```java
String cacheKey = CacheKey.XXX.name() + ":" + id;
redisService.evict(cacheKey);
```
