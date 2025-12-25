package com.leaf.graphql_bff;

import com.leaf.framework.exception.ExceptionTranslator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@ComponentScan(
    basePackages = { "com.leaf.graphql_bff", "com.leaf.framework" },
    excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = ExceptionTranslator.class)
)
public class GraphqlBffApplication {

    public static void main(String[] args) {
        SpringApplication.run(GraphqlBffApplication.class, args);
    }
}
