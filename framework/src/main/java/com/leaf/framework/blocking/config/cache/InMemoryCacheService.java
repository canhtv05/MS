package com.leaf.framework.blocking.config.cache;

import com.leaf.common.utils.CommonUtils;
import com.leaf.common.utils.JsonF;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class InMemoryCacheService {

    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public <V> void set(String key, V value) {
        try {
            if (CommonUtils.isEmpty(key, value)) return;

            String data = JsonF.toJson(value);
            cache.put(key, data);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public <V> V get(String key, Class<V> clazz) {
        try {
            if (CommonUtils.isEmpty(key)) return null;

            String data = cache.get(key);
            if (Objects.isNull(data)) return null;
            return JsonF.jsonToObject(data, clazz);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    public void evict(String key) {
        try {
            if (Objects.isNull(key)) return;

            cache.remove(key);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }
}
