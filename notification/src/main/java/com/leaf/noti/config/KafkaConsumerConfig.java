package com.leaf.noti.config;

import com.leaf.common.constant.EventConstants;
import com.leaf.common.dto.event.ForgotPasswordEvent;
import com.leaf.common.dto.event.VerificationEmailEvent;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.CommonErrorHandler;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.messaging.converter.MessageConversionException;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
@RequiredArgsConstructor
public class KafkaConsumerConfig {

    private final KafkaConsumerProperties kafkaConsumerProperties;

    private Map<String, Object> stringConsumerProps(String groupId) {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaConsumerProperties.getBootstrapServers());
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(
            ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
            kafkaConsumerProperties.getConsumer().getKeyDeserializer()
        );
        props.put(
            ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
            kafkaConsumerProperties.getConsumer().getValueDeserializer()
        );
        props.put(JsonDeserializer.TRUSTED_PACKAGES, kafkaConsumerProperties.getConsumer().getTrustedPackages());
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        return props;
    }

    private <T> ConcurrentKafkaListenerContainerFactory<String, T> buildFactory(Class<T> clazz, String groupId) {
        DefaultKafkaConsumerFactory<String, T> consumerFactory = new DefaultKafkaConsumerFactory<>(
            stringConsumerProps(groupId),
            new StringDeserializer(),
            new JsonDeserializer<>(clazz, false)
        );
        ConcurrentKafkaListenerContainerFactory<String, T> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.setCommonErrorHandler(errorHandler());
        return factory;
    }

    @Bean
    public CommonErrorHandler errorHandler() {
        DefaultErrorHandler errorHandler = new DefaultErrorHandler(new FixedBackOff(0L, 0));
        errorHandler.addNotRetryableExceptions(MessageConversionException.class);
        return errorHandler;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<
        String,
        ForgotPasswordEvent
    > forgotPasswordKafkaListenerContainerFactory() {
        return buildFactory(ForgotPasswordEvent.class, EventConstants.FORGOT_PASSWORD_GROUP_ID);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<
        String,
        VerificationEmailEvent
    > verificationEmailKafkaListenerContainerFactory() {
        return buildFactory(VerificationEmailEvent.class, EventConstants.VERIFICATION_EMAIL_GROUP_ID);
    }
}
