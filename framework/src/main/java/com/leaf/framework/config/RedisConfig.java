package com.leaf.framework.config;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(ApplicationProperties.class)
public class RedisConfig {

    private final ApplicationProperties appConfigs;

    @Bean
    Config config() {
        Config config = new Config();

        String password = appConfigs.getRedis().getPassword();
        String address = appConfigs.getRedis().getAddress();
        if (StringUtils.isNotBlank(password)) {
            String enCodePassword = URLEncoder.encode(password, StandardCharsets.UTF_8);
            String rawAddress = address.replace("redis://", "").replace("rediss://", "");
            address = "redis://" + enCodePassword + "@" + rawAddress;
        }
        if (!address.startsWith("redis://") && !address.startsWith("rediss://")) address = "redis://" + address;

        var single = config
            .useSingleServer()
            .setAddress(address)
            .setConnectionPoolSize(appConfigs.getRedis().getMaxPoolSize())
            .setTimeout(10000)
            .setConnectTimeout(10000)
            .setConnectionMinimumIdleSize(appConfigs.getRedis().getMinimumIdle());

        if (StringUtils.isNotBlank(appConfigs.getRedis().getClientName())) single.setClientName(
            appConfigs.getRedis().getClientName()
        );
        return config;
    }

    @Bean
    RedissonClient redissonClient(Config config) {
        return Redisson.create(config);
    }
}
