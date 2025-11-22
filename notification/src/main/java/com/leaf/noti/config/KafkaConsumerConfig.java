package com.leaf.noti.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.lang.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import com.leaf.common.dto.event.VerificationEmailEvent;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class KafkaConsumerConfig {

  private final KafkaConsumerProperties kafkaConsumerProperties;

  @Bean
  @NonNull
  public ConsumerFactory<String, VerificationEmailEvent> verificationEmailEventConsumerFactory() {
    Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaConsumerProperties.getBootstrapServers());
    props.put(ConsumerConfig.GROUP_ID_CONFIG, kafkaConsumerProperties.getConsumer().getGroupId());
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, kafkaConsumerProperties.getConsumer().getKeyDeserializer());
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
        kafkaConsumerProperties.getConsumer().getValueDeserializer());
    props.put(JsonDeserializer.TRUSTED_PACKAGES, kafkaConsumerProperties.getConsumer().getTrustedPackages());
    props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
    props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);

    return new DefaultKafkaConsumerFactory<>(
        props,
        new StringDeserializer(),
        new JsonDeserializer<>(VerificationEmailEvent.class, false));
  }

  @Bean
  public ConcurrentKafkaListenerContainerFactory<String, VerificationEmailEvent> verificationEmailEventListenerFactory() {
    ConcurrentKafkaListenerContainerFactory<String, VerificationEmailEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();

    factory.setConsumerFactory(verificationEmailEventConsumerFactory());
    return factory;
  }
}
