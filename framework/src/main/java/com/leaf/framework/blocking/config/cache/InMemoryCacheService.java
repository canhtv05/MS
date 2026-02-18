package com.leaf.framework.blocking.config.cache;

import com.leaf.common.utils.CommonUtils;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class InMemoryCacheService<K, V> {

    private final Map<K, V> cache = new ConcurrentHashMap<>();

    public void put(K key, V value) {
        try {
            if (CommonUtils.isEmpty(key, value)) return;
            cache.put(key, value);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public Optional<V> get(K key) {
        try {
            if (CommonUtils.isEmpty(key)) return Optional.empty();
            return Optional.ofNullable(cache.get(key));
        } catch (Exception e) {
            log.error(e.getMessage());
            return Optional.empty();
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
