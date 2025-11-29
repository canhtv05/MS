package com.leaf.auth.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class KafkaProducerService {

    KafkaTemplate<String, Object> kafkaTemplate;

    public <T> void send(String topic, T message) {
        kafkaTemplate.send(topic, message);
    }
}
