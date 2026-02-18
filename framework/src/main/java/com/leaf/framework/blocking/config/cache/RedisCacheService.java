package com.leaf.framework.blocking.config.cache;

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

@Service
@Slf4j
@RequiredArgsConstructor
public class RedisCacheService {

    private final RedissonClient redission;

    private RBucket<String> getBucket(String key) {
        return redission.getBucket(key, StringCodec.INSTANCE);
    }

    public <K, V> void set(K key, V value, long ttl, TimeUnit timeUnit) {
        try {
            if (CommonUtils.isEmpty(key, value)) return;

            String data = JsonF.toJson(value);
            Duration duration = Duration.of(ttl, timeUnit.toChronoUnit());
            this.getBucket(key.toString()).set(data, duration);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public <K, V> void set(K key, V value) {
        try {
            if (CommonUtils.isEmpty(key, value)) return;

            String data = JsonF.toJson(value);
            this.getBucket(key.toString()).set(data);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public <K, V> V get(K key, Class<V> clazz) {
        try {
            if (CommonUtils.isEmpty(key)) return null;

            String data = this.getBucket(key.toString()).get();
            if (Objects.isNull(data)) return null;
            return JsonF.jsonToObject(data, clazz);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public <K> void evict(K key) {
        try {
            if (Objects.isNull(key)) return;

            this.getBucket(key.toString()).delete();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }
}
