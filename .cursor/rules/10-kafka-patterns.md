# Kafka Patterns

## Kafka Listener

```java
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaListenerService {

  private final XxxService service;

  @KafkaListener(
    topics = EventConstants.XXX_TOPIC,
    groupId = EventConstants.XXX_GROUP_ID,
    containerFactory = "xxxKafkaListenerContainerFactory"
  )
  public void handleXxxEvent(XxxEvent event) {
    try {
      service.processEvent(event);
    } catch (Exception e) {
      log.error("Failed to process event: {}", event, e);
    }
  }
}
```

## Kafka Producer

```java
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

  private final KafkaTemplate<String, Object> kafkaTemplate;

  public void send(String topic, Object event) {
    kafkaTemplate.send(topic, event);
  }
}
```
