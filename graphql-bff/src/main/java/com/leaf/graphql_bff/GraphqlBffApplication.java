package com.leaf.graphql_bff;

import com.leaf.framework.blocking.exception.ExceptionTranslator;
import com.leaf.framework.blocking.security.CustomJwtDecoder;
import com.leaf.framework.blocking.security.SecurityConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@ComponentScan(
    basePackages = { "com.leaf" },
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = ExceptionTranslator.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SecurityConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = CustomJwtDecoder.class)
    }
)
public class GraphqlBffApplication {

    public static void main(String[] args) {
        SpringApplication.run(GraphqlBffApplication.class, args);
    }
}
