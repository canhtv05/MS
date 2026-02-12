package com.leaf.framework.reactive.cache;

import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.JsonF;
import java.time.Duration;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.StringCodec;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

/**
 * Reactive version of RedisCacheService for use in reactive contexts (e.g.,
 * Spring Cloud Gateway).
 * Wraps blocking Redisson calls in reactive Mono using boundedElastic
 * scheduler.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReactiveRedisCacheService {

    private final RedissonClient redissonClient;

    private RBucket<String> getBucket(String key) {
        return redissonClient.getBucket(key, StringCodec.INSTANCE);
    }

    public <K, V> Mono<Void> set(K key, V value, long ttl, TimeUnit timeUnit) {
        return Mono.fromCallable(() -> {
            try {
                if (CommonUtils.isEmpty(key, value)) {
                    return null;
                }

                String data = JsonF.toJson(value);
                Duration duration = Duration.of(ttl, timeUnit.toChronoUnit());
                this.getBucket(key.toString()).set(data, duration);
                return null;
            } catch (Exception e) {
                log.error("Error setting cache with TTL: {}", e.getMessage(), e);
                throw new RuntimeException(e);
            }
        })
            .subscribeOn(Schedulers.boundedElastic())
            .then();
    }

    public <K, V> Mono<Void> set(K key, V value) {
        return Mono.fromCallable(() -> {
            try {
                if (CommonUtils.isEmpty(key, value)) {
                    return null;
                }

                String data = JsonF.toJson(value);
                this.getBucket(key.toString()).set(data);
                return null;
            } catch (Exception e) {
                log.error("Error setting cache: {}", e.getMessage(), e);
                throw new RuntimeException(e);
            }
        })
            .subscribeOn(Schedulers.boundedElastic())
            .then();
    }

    public <K, V> Mono<V> get(K key, Class<V> clazz) {
        return Mono.fromCallable(() -> {
            try {
                if (CommonUtils.isEmpty(key)) {
                    return null;
                }

                String data = this.getBucket(key.toString()).get();
                if (Objects.isNull(data)) {
                    return null;
                }
                return JsonF.jsonToObject(data, clazz);
            } catch (Exception e) {
                log.error("Error getting cache: {}", e.getMessage(), e);
                return null;
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    public <K> Mono<Void> evict(K key) {
        return Mono.fromCallable(() -> {
            try {
                if (Objects.isNull(key)) {
                    return null;
                }

                this.getBucket(key.toString()).delete();
                return null;
            } catch (Exception e) {
                log.error("Error evicting cache: {}", e.getMessage(), e);
                throw new RuntimeException(e);
            }
        })
            .subscribeOn(Schedulers.boundedElastic())
            .then();
    }
}
