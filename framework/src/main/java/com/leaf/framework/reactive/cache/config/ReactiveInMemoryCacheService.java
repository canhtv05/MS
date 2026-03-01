package com.leaf.framework.reactive.cache.config;

import com.leaf.common.utils.CommonUtils;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class ReactiveInMemoryCacheService<K, V> {

    private final Map<K, V> cache = new ConcurrentHashMap<>();

    public Mono<Void> put(K key, V value) {
        try {
            if (CommonUtils.isEmpty(key, value)) return Mono.empty();
            cache.put(key, value);
            return Mono.empty();
        } catch (Exception e) {
            log.error(e.getMessage());
            return Mono.error(e);
        }
    }

    public Mono<V> get(K key) {
        try {
            if (CommonUtils.isEmpty(key)) return Mono.empty();
            return Mono.justOrEmpty(cache.get(key));
        } catch (Exception e) {
            log.error(e.getMessage());
            return Mono.error(e);
        }
    }

    public void evict(K key) {
        try {
            if (Objects.isNull(key)) return;
            cache.remove(key);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public boolean containsKey(K key) {
        return cache.containsKey(key);
    }

    public void remove(K key) {
        try {
            if (Objects.isNull(key)) return;
            cache.remove(key);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public void clear() {
        try {
            cache.clear();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public int size() {
        try {
            return cache.size();
        } catch (Exception e) {
            log.error(e.getMessage());
            return 0;
        }
    }
}
