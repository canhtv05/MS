package com.leaf.framework.config;

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
        var single = config
            .useSingleServer()
            .setAddress(appConfigs.getRedis().getAddress())
            .setConnectionPoolSize(appConfigs.getRedis().getMaxPoolSize())
            .setTimeout(10000)
            .setConnectTimeout(10000)
            .setConnectionMinimumIdleSize(appConfigs.getRedis().getMinimumIdle());

        if (StringUtils.isNotBlank(appConfigs.getRedis().getClientName())) single.setClientName(
            appConfigs.getRedis().getClientName()
        );

        if (StringUtils.isNotBlank(appConfigs.getRedis().getPassword())) single.setPassword(
            appConfigs.getRedis().getPassword()
        );
        return config;
    }

    @Bean
    RedissonClient redissonClient(Config config) {
        return Redisson.create(config);
    }
}
