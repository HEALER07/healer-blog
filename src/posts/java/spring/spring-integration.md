---
title: Spring Integration
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 集成
date: 2024-03-19
---

# Spring Integration

## 基础配置

### 1. 项目配置
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-integration</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
</dependencies>
```

### 2. 集成配置
```java
@Configuration
@EnableIntegration
public class IntegrationConfig {
    
    @Bean
    public MessageChannel inputChannel() {
        return new DirectChannel();
    }
    
    @Bean
    public MessageChannel outputChannel() {
        return new DirectChannel();
    }
    
    @Bean
    public MessageChannel errorChannel() {
        return new PublishSubscribeChannel();
    }
    
    @Bean
    public MessageChannel auditChannel() {
        return new QueueChannel();
    }
}
```

### 3. 消息转换器
```java
@Configuration
public class MessageConverterConfig {
    
    @Bean
    public MessageConverter messageConverter() {
        return new MappingJackson2MessageConverter();
    }
    
    @Bean
    public MessageConverter xmlMessageConverter() {
        return new MarshallingMessageConverter(
            new Jaxb2Marshaller(),
            new Jaxb2Unmarshaller()
        );
    }
}
```

## 消息处理

### 1. 消息过滤器
```java
@Configuration
public class FilterConfig {
    
    @Bean
    public MessageFilter messageFilter() {
        MessageFilter filter = new MessageFilter(
            message -> message.getPayload() instanceof String &&
                      ((String) message.getPayload()).length() > 5
        );
        filter.setDiscardChannel(errorChannel());
        return filter;
    }
    
    @Bean
    public IntegrationFlow filterFlow() {
        return IntegrationFlows
            .from(inputChannel())
            .filter(messageFilter())
            .channel(outputChannel())
            .get();
    }
}
```

### 2. 消息转换器
```java
@Configuration
public class TransformerConfig {
    
    @Bean
    public MessageTransformer messageTransformer() {
        return message -> {
            String payload = (String) message.getPayload();
            return MessageBuilder
                .withPayload(payload.toUpperCase())
                .copyHeaders(message.getHeaders())
                .build();
        };
    }
    
    @Bean
    public IntegrationFlow transformFlow() {
        return IntegrationFlows
            .from(inputChannel())
            .transform(messageTransformer())
            .channel(outputChannel())
            .get();
    }
}
```

### 3. 消息路由器
```java
@Configuration
public class RouterConfig {
    
    @Bean
    public MessageRouter messageRouter() {
        ContentBasedRouter router = new ContentBasedRouter();
        router.setChannelMapping("order", "orderChannel");
        router.setChannelMapping("payment", "paymentChannel");
        router.setDefaultOutputChannel(errorChannel());
        return router;
    }
    
    @Bean
    public IntegrationFlow routerFlow() {
        return IntegrationFlows
            .from(inputChannel())
            .route(messageRouter())
            .get();
    }
}
```

## 通道适配器

### 1. HTTP 适配器
```java
@Configuration
public class HttpAdapterConfig {
    
    @Bean
    public HttpInboundChannelAdapter httpInboundAdapter() {
        HttpInboundChannelAdapter adapter = new HttpInboundChannelAdapter();
        adapter.setRequestChannel(inputChannel());
        adapter.setRequestMappingHandlerMapping(requestMappingHandlerMapping());
        return adapter;
    }
    
    @Bean
    public HttpOutboundChannelAdapter httpOutboundAdapter() {
        HttpOutboundChannelAdapter adapter = new HttpOutboundChannelAdapter();
        adapter.setRequestChannel(outputChannel());
        adapter.setHttpMethod(HttpMethod.POST);
        adapter.setExpectedResponseType(String.class);
        return adapter;
    }
}
```

### 2. JMS 适配器
```java
@Configuration
public class JmsAdapterConfig {
    
    @Bean
    public JmsInboundChannelAdapter jmsInboundAdapter(
            ConnectionFactory connectionFactory) {
        JmsInboundChannelAdapter adapter = new JmsInboundChannelAdapter(
            new DefaultJmsListenerContainerFactory(connectionFactory)
        );
        adapter.setDestination(new ActiveMQQueue("input.queue"));
        adapter.setOutputChannel(inputChannel());
        return adapter;
    }
    
    @Bean
    public JmsOutboundChannelAdapter jmsOutboundAdapter(
            ConnectionFactory connectionFactory) {
        JmsOutboundChannelAdapter adapter = new JmsOutboundChannelAdapter(
            new JmsTemplate(connectionFactory)
        );
        adapter.setDestination(new ActiveMQQueue("output.queue"));
        adapter.setInputChannel(outputChannel());
        return adapter;
    }
}
```

### 3. 邮件适配器
```java
@Configuration
public class MailAdapterConfig {
    
    @Bean
    public ImapMailReceiver imapMailReceiver() {
        ImapMailReceiver receiver = new ImapMailReceiver();
        receiver.setUrl("imap://user:password@imap.example.com/INBOX");
        receiver.setOutputChannel(inputChannel());
        return receiver;
    }
    
    @Bean
    public SmtpMailSender smtpMailSender() {
        SmtpMailSender sender = new SmtpMailSender();
        sender.setHost("smtp.example.com");
        sender.setPort(587);
        sender.setUsername("user");
        sender.setPassword("password");
        return sender;
    }
}
```

## 高级特性

### 1. 消息聚合器
```java
@Configuration
public class AggregatorConfig {
    
    @Bean
    public MessageGroupStore messageGroupStore() {
        return new SimpleMessageStore();
    }
    
    @Bean
    public AggregatingMessageHandler aggregator() {
        AggregatingMessageHandler handler = new AggregatingMessageHandler(
            new DefaultAggregatingMessageGroupProcessor(),
            messageGroupStore()
        );
        handler.setOutputChannel(outputChannel());
        handler.setSendPartialResultOnExpiry(true);
        return handler;
    }
    
    @Bean
    public IntegrationFlow aggregatorFlow() {
        return IntegrationFlows
            .from(inputChannel())
            .aggregate(aggregator())
            .channel(outputChannel())
            .get();
    }
}
```

### 2. 消息分割器
```java
@Configuration
public class SplitterConfig {
    
    @Bean
    public MessageSplitter messageSplitter() {
        return new DefaultMessageSplitter();
    }
    
    @Bean
    public IntegrationFlow splitterFlow() {
        return IntegrationFlows
            .from(inputChannel())
            .split(messageSplitter())
            .channel(outputChannel())
            .get();
    }
}
```

### 3. 服务激活器
```java
@Configuration
public class ServiceActivatorConfig {
    
    @Bean
    public ServiceActivatingHandler serviceActivator() {
        ServiceActivatingHandler handler = new ServiceActivatingHandler(
            message -> {
                // 处理消息
                return ((String) message.getPayload()).toUpperCase();
            }
        );
        handler.setOutputChannel(outputChannel());
        return handler;
    }
    
    @Bean
    public IntegrationFlow serviceActivatorFlow() {
        return IntegrationFlows
            .from(inputChannel())
            .handle(serviceActivator())
            .get();
    }
}
```

## 练习

1. 基础集成实践：
   - 实现消息通道
   - 实现消息转换
   - 实现消息路由

2. 适配器实践：
   - 实现 HTTP 适配器
   - 实现 JMS 适配器
   - 实现邮件适配器

3. 高级特性实践：
   - 实现消息聚合
   - 实现消息分割
   - 实现服务激活

4. 集成实践：
   - 集成消息队列
   - 集成外部系统
   - 集成监控系统

::: tip
Spring Integration 提供了丰富的企业集成模式实现，适合构建复杂的集成系统。
:::

::: info 扩展阅读
- [Spring Integration 官方文档](https://docs.spring.io/spring-integration/docs/current/reference/html/)
- [企业集成模式](https://www.enterpriseintegrationpatterns.com/)
- [Spring Integration 示例](https://github.com/spring-projects/spring-integration/tree/main/spring-integration-samples)
::: 