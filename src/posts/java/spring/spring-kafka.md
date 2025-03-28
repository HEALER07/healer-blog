---
title: Spring Kafka
icon: java
order: 6
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 消息队列
date: 2024-03-19
---

# Spring Kafka

## 基础配置

### 1. Kafka 配置
```java
@Configuration
public class KafkaConfig {
    
    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "test-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, 
            StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, 
            StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(props);
    }
    
    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, 
            StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, 
            StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(props);
    }
    
    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
```

### 2. 主题配置
```java
@Configuration
public class TopicConfig {
    
    @Bean
    public NewTopic orderTopic() {
        return TopicBuilder.name("order-topic")
            .partitions(3)
            .replicas(2)
            .build();
    }
    
    @Bean
    public NewTopic userTopic() {
        return TopicBuilder.name("user-topic")
            .partitions(2)
            .replicas(1)
            .build();
    }
    
    @Bean
    public NewTopic notificationTopic() {
        return TopicBuilder.name("notification-topic")
            .partitions(1)
            .replicas(3)
            .build();
    }
}
```

### 3. 消息转换器
```java
@Configuration
public class MessageConverterConfig {
    
    @Bean
    public RecordMessageConverter jsonMessageConverter() {
        return new JsonMessageConverter();
    }
    
    @Bean
    public RecordMessageConverter customMessageConverter() {
        return new RecordMessageConverter() {
            @Override
            public Message<?> toMessage(ConsumerRecord<?, ?> record, 
                    Acknowledgment acknowledgment) {
                return MessageBuilder
                    .withPayload(record.value())
                    .setHeader(KafkaHeaders.RECEIVED_TOPIC, record.topic())
                    .setHeader(KafkaHeaders.RECEIVED_PARTITION, record.partition())
                    .setHeader(KafkaHeaders.OFFSET, record.offset())
                    .build();
            }
            
            @Override
            public ProducerRecord<?, ?> fromMessage(Message<?> message, 
                    String defaultTopic) {
                return new ProducerRecord<>(
                    defaultTopic,
                    message.getPayload().toString()
                );
            }
        };
    }
}
```

## 消息发送

### 1. 基本发送
```java
@Service
public class MessageSender {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
    }
    
    public void sendMessageWithKey(String topic, String key, String message) {
        kafkaTemplate.send(topic, key, message);
    }
    
    public void sendMessageWithCallback(String topic, String message) {
        kafkaTemplate.send(topic, message)
            .addCallback(
                success -> log.info("Message sent successfully"),
                failure -> log.error("Failed to send message", failure)
            );
    }
}
```

### 2. 批量发送
```java
@Service
public class BatchSender {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    public void sendBatch(String topic, List<String> messages) {
        messages.forEach(message -> {
            kafkaTemplate.send(topic, message);
        });
    }
    
    public void sendBatchWithTransaction(String topic, List<String> messages) {
        kafkaTemplate.executeInTransaction(operations -> {
            messages.forEach(message -> {
                operations.send(topic, message);
            });
        });
    }
}
```

## 消息接收

### 1. 基本接收
```java
@Service
public class MessageReceiver {
    
    @KafkaListener(topics = "order-topic")
    public void receiveMessage(String message) {
        log.info("Received message: {}", message);
    }
    
    @KafkaListener(topics = "user-topic")
    public void receiveMessageWithHeaders(
            String message,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {
        log.info("Received message: {} from topic: {}, partition: {}", 
            message, topic, partition);
    }
}
```

### 2. 批量接收
```java
@Service
public class BatchReceiver {
    
    @KafkaListener(
        topics = "order-topic",
        containerFactory = "batchFactory"
    )
    public void receiveBatch(List<String> messages) {
        messages.forEach(message -> {
            log.info("Received message: {}", message);
        });
    }
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> batchFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setBatchListener(true);
        return factory;
    }
}
```

## 高级特性

### 1. 消息确认
```java
@Configuration
public class AcknowledgeConfig {
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> ackFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.getContainerProperties().setAckMode(AckMode.MANUAL_IMMEDIATE);
        return factory;
    }
    
    @KafkaListener(
        topics = "order-topic",
        containerFactory = "ackFactory"
    )
    public void receiveWithAck(
            String message,
            Acknowledgment acknowledgment) {
        try {
            processMessage(message);
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Error processing message", e);
        }
    }
}
```

### 2. 错误处理
```java
@Configuration
public class ErrorHandlingConfig {
    
    @Bean
    public DeadLetterPublishingRecoverer recoverer(
            KafkaTemplate<String, String> template) {
        return new DeadLetterPublishingRecoverer(template,
            (record, ex) -> new TopicPartition(
                record.topic() + ".DLT",
                record.partition()
            )
        );
    }
    
    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();
        retryTemplate.setRetryPolicy(new SimpleRetryPolicy(3));
        retryTemplate.setBackOffPolicy(new FixedBackOffPolicy());
        return retryTemplate;
    }
    
    @KafkaListener(
        topics = "order-topic",
        errorHandler = "recoverer"
    )
    public void receiveWithRetry(String message) {
        retryTemplate.execute(context -> {
            processMessage(message);
            return null;
        });
    }
}
```

### 3. 消息过滤
```java
@Configuration
public class FilterConfig {
    
    @Bean
    public RecordFilterStrategy<String, String> filterStrategy() {
        return record -> {
            String value = record.value();
            return value != null && value.startsWith("valid");
        };
    }
    
    @KafkaListener(
        topics = "order-topic",
        containerFactory = "filterFactory"
    )
    public void receiveFiltered(String message) {
        log.info("Received filtered message: {}", message);
    }
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> filterFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setRecordFilterStrategy(filterStrategy());
        return factory;
    }
}
```

## 练习

1. 基础消息实践：
   - 实现消息发送
   - 实现消息接收
   - 实现消息转换

2. 高级特性实践：
   - 实现消息确认
   - 实现错误处理
   - 实现消息过滤

3. 可靠性实践：
   - 实现消息持久化
   - 实现消息重试
   - 实现死信处理

4. 性能实践：
   - 实现批量处理
   - 实现并发处理
   - 实现分区管理

::: tip
Kafka 系统需要考虑可靠性、性能和可扩展性，建议根据实际需求选择合适的配置和策略。
:::

::: info 扩展阅读
- [Spring Kafka 官方文档](https://docs.spring.io/spring-kafka/docs/current/reference/html/)
- [Apache Kafka 官方文档](https://kafka.apache.org/documentation/)
- [Spring Kafka 示例](https://github.com/spring-projects/spring-kafka/tree/main/samples)
:::