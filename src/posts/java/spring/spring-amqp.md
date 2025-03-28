---
title: Spring AMQP
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 消息队列
date: 2021-03-19
---

# Spring AMQP

## 基础配置

### 1. RabbitMQ 配置
```java
@Configuration
public class RabbitConfig {
    
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory factory = new CachingConnectionFactory();
        factory.setHost("localhost");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");
        return factory;
    }
    
    @Bean
    public AmqpTemplate amqpTemplate() {
        return new RabbitTemplate(connectionFactory());
    }
    
    @Bean
    public AmqpAdmin amqpAdmin() {
        return new RabbitAdmin(connectionFactory());
    }
}
```

### 2. 队列和交换机配置
```java
@Configuration
public class QueueConfig {
    
    @Bean
    public Queue orderQueue() {
        return new Queue("order.queue", true);
    }
    
    @Bean
    public Exchange orderExchange() {
        return new DirectExchange("order.exchange");
    }
    
    @Bean
    public Binding binding() {
        return BindingBuilder
            .bind(orderQueue())
            .to(orderExchange())
            .with("order.create")
            .noargs();
    }
}
```

### 3. 消息转换器
```java
@Configuration
public class MessageConverterConfig {
    
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    @Bean
    public MessageConverter simpleMessageConverter() {
        return new SimpleMessageConverter();
    }
    
    @Bean
    public MessageConverter customMessageConverter() {
        return new MessageConverter() {
            @Override
            public Message toMessage(Object object, MessageProperties messageProperties) {
                // 自定义转换逻辑
                return new Message(object.toString().getBytes(), messageProperties);
            }
            
            @Override
            public Object fromMessage(Message message) {
                // 自定义转换逻辑
                return new String(message.getBody());
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
    private AmqpTemplate amqpTemplate;
    
    public void sendMessage(String message) {
        amqpTemplate.convertAndSend(
            "order.exchange",
            "order.create",
            message
        );
    }
    
    public void sendMessageWithCallback(String message) {
        amqpTemplate.convertAndSend(
            "order.exchange",
            "order.create",
            message,
            new MessagePostProcessor() {
                @Override
                public Message postProcessMessage(Message message) {
                    message.getMessageProperties().setHeader("priority", "high");
                    return message;
                }
            }
        );
    }
}
```

### 2. 批量发送
```java
@Service
public class BatchSender {
    
    @Autowired
    private AmqpTemplate amqpTemplate;
    
    public void sendBatch(List<String> messages) {
        messages.forEach(message -> {
            amqpTemplate.convertAndSend(
                "order.exchange",
                "order.create",
                message
            );
        });
    }
    
    public void sendBatchWithTransaction(List<String> messages) {
        amqpTemplate.execute(channel -> {
            try {
                channel.txSelect();
                messages.forEach(message -> {
                    channel.basicPublish(
                        "order.exchange",
                        "order.create",
                        null,
                        message.getBytes()
                    );
                });
                channel.txCommit();
            } catch (Exception e) {
                channel.txRollback();
                throw e;
            }
        });
    }
}
```

## 消息接收

### 1. 基本接收
```java
@Service
public class MessageReceiver {
    
    @RabbitListener(queues = "order.queue")
    public void receiveMessage(String message) {
        System.out.println("Received message: " + message);
    }
    
    @RabbitListener(queues = "order.queue")
    public void receiveMessageWithHeaders(
            String message,
            @Header("priority") String priority) {
        System.out.println("Received message: " + message + 
            " with priority: " + priority);
    }
}
```

### 2. 批量接收
```java
@Service
public class BatchReceiver {
    
    @RabbitListener(queues = "order.queue", containerFactory = "batchFactory")
    public void receiveBatch(List<String> messages) {
        messages.forEach(message -> {
            System.out.println("Received message: " + message);
        });
    }
    
    @Bean
    public SimpleRabbitListenerContainerFactory batchFactory() {
        SimpleRabbitListenerContainerFactory factory = 
            new SimpleRabbitListenerContainerFactory();
        factory.setBatchSize(10);
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
    public SimpleRabbitListenerContainerFactory ackFactory() {
        SimpleRabbitListenerContainerFactory factory = 
            new SimpleRabbitListenerContainerFactory();
        factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        return factory;
    }
    
    @RabbitListener(queues = "order.queue", containerFactory = "ackFactory")
    public void receiveWithAck(
            String message,
            Channel channel,
            @Header(AmqpHeaders.DELIVERY_TAG) long tag) {
        try {
            // 处理消息
            processMessage(message);
            // 确认消息
            channel.basicAck(tag, false);
        } catch (Exception e) {
            try {
                // 拒绝消息
                channel.basicNack(tag, false, true);
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
}
```

### 2. 死信队列
```java
@Configuration
public class DeadLetterConfig {
    
    @Bean
    public Queue deadLetterQueue() {
        return new Queue("dead.letter.queue");
    }
    
    @Bean
    public Exchange deadLetterExchange() {
        return new DirectExchange("dead.letter.exchange");
    }
    
    @Bean
    public Binding deadLetterBinding() {
        return BindingBuilder
            .bind(deadLetterQueue())
            .to(deadLetterExchange())
            .with("dead.letter")
            .noargs();
    }
    
    @Bean
    public Queue orderQueueWithDeadLetter() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", "dead.letter.exchange");
        args.put("x-dead-letter-routing-key", "dead.letter");
        return new Queue("order.queue", true, false, false, args);
    }
}
```

### 3. 延迟队列
```java
@Configuration
public class DelayQueueConfig {
    
    @Bean
    public Queue delayQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-message-ttl", 60000);
        args.put("x-dead-letter-exchange", "order.exchange");
        args.put("x-dead-letter-routing-key", "order.create");
        return new Queue("delay.queue", true, false, false, args);
    }
    
    @Bean
    public Exchange delayExchange() {
        return new DirectExchange("delay.exchange");
    }
    
    @Bean
    public Binding delayBinding() {
        return BindingBuilder
            .bind(delayQueue())
            .to(delayExchange())
            .with("delay")
            .noargs();
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
   - 实现死信队列
   - 实现延迟队列

3. 可靠性实践：
   - 实现消息持久化
   - 实现消息重试
   - 实现消息监控

4. 性能实践：
   - 实现批量处理
   - 实现并发处理
   - 实现负载均衡

::: tip
消息队列系统需要考虑可靠性、性能和可维护性，建议根据实际需求选择合适的配置和策略。
:::

::: info 扩展阅读
- [Spring AMQP 官方文档](https://docs.spring.io/spring-amqp/docs/current/reference/html/)
- [RabbitMQ 官方文档](https://www.rabbitmq.com/documentation.html)
- [Spring AMQP 示例](https://github.com/spring-projects/spring-amqp-samples)
:::