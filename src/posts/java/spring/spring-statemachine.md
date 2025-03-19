---
title: Spring Statemachine
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 状态机
date: 2024-03-19
---

# Spring Statemachine

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
        <groupId>org.springframework.statemachine</groupId>
        <artifactId>spring-statemachine-core</artifactId>
        <version>3.2.1</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
</dependencies>
```

### 2. 状态机配置
```java
@Configuration
@EnableStateMachineFactory
public class StateMachineConfig {
    
    @Bean
    public StateMachineFactory<OrderState, OrderEvent> stateMachineFactory() {
        StateMachineBuilder.Builder<OrderState, OrderEvent> builder = 
            StateMachineBuilder.builder();
            
        builder.configureStates()
            .withStates()
            .initial(OrderState.CREATED)
            .states(EnumSet.allOf(OrderState.class));
            
        builder.configureTransitions()
            .withExternal()
                .source(OrderState.CREATED)
                .target(OrderState.PAID)
                .event(OrderEvent.PAY)
                .and()
            .withExternal()
                .source(OrderState.PAID)
                .target(OrderState.SHIPPED)
                .event(OrderEvent.SHIP)
                .and()
            .withExternal()
                .source(OrderState.SHIPPED)
                .target(OrderState.DELIVERED)
                .event(OrderEvent.DELIVER);
                
        return builder.build();
    }
}
```

### 3. 状态和事件定义
```java
public enum OrderState {
    CREATED,
    PAID,
    SHIPPED,
    DELIVERED,
    CANCELLED
}

public enum OrderEvent {
    PAY,
    SHIP,
    DELIVER,
    CANCEL
}
```

## 状态机实现

### 1. 状态机服务
```java
@Service
public class OrderStateMachineService {
    
    @Autowired
    private StateMachineFactory<OrderState, OrderEvent> stateMachineFactory;
    
    @Autowired
    private OrderRepository orderRepository;
    
    public Order createOrder(Order order) {
        order.setState(OrderState.CREATED);
        order = orderRepository.save(order);
        
        StateMachine<OrderState, OrderEvent> sm = build(order);
        sm.start();
        
        return order;
    }
    
    public Order payOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
            
        StateMachine<OrderState, OrderEvent> sm = build(order);
        sm.sendEvent(OrderEvent.PAY);
        
        order.setState(sm.getState().getId());
        return orderRepository.save(order);
    }
    
    private StateMachine<OrderState, OrderEvent> build(Order order) {
        StateMachine<OrderState, OrderEvent> sm = 
            stateMachineFactory.getStateMachine(order.getId());
        sm.stop();
        sm.getExtendedState().getVariables().put("order", order);
        return sm;
    }
}
```

### 2. 状态监听器
```java
@Component
public class OrderStateChangeInterceptor implements StateMachineInterceptor<OrderState, OrderEvent> {
    
    @Override
    public StateContext<OrderState, OrderEvent> preTransition(
            StateContext<OrderState, OrderEvent> context) {
        Optional.ofNullable(context.getMessage()).ifPresent(message -> {
            Optional.ofNullable(message.getHeaders().get("order")).ifPresent(order -> {
                Order orderObj = (Order) order;
                orderObj.setState(context.getTarget().getId());
            });
        });
        return context;
    }
}
```

### 3. 状态机持久化
```java
@Configuration
public class StateMachinePersistenceConfig {
    
    @Bean
    public StateMachinePersister<OrderState, OrderEvent, Order> persister(
            JdbcTemplate jdbcTemplate) {
        return new DefaultStateMachinePersister<>(
            new JdbcStateMachinePersist<>(
                new StateMachinePersist<OrderState, OrderEvent, Order>() {
                    @Override
                    public void write(StateMachineContext<OrderState, OrderEvent> context, 
                            Order order) throws Exception {
                        jdbcTemplate.update(
                            "UPDATE orders SET state = ? WHERE id = ?",
                            context.getState().name(),
                            order.getId()
                        );
                    }
                    
                    @Override
                    public StateMachineContext<OrderState, OrderEvent> read(Order order) 
                            throws Exception {
                        return new DefaultStateMachineContext<>(
                            OrderState.valueOf(order.getState()),
                            null,
                            null,
                            null
                        );
                    }
                }
            )
        );
    }
}
```

## 高级特性

### 1. 状态机动作
```java
@Component
public class OrderStateMachineActions {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private PaymentService paymentService;
    
    public void sendNotification(StateContext<OrderState, OrderEvent> context) {
        Order order = context.getExtendedState().get("order", Order.class);
        notificationService.sendNotification(order);
    }
    
    public void processPayment(StateContext<OrderState, OrderEvent> context) {
        Order order = context.getExtendedState().get("order", Order.class);
        paymentService.processPayment(order);
    }
}
```

### 2. 状态机守卫
```java
@Component
public class OrderStateMachineGuards {
    
    @Autowired
    private PaymentService paymentService;
    
    public boolean checkPayment(StateContext<OrderState, OrderEvent> context) {
        Order order = context.getExtendedState().get("order", Order.class);
        return paymentService.isPaymentValid(order);
    }
    
    public boolean checkInventory(StateContext<OrderState, OrderEvent> context) {
        Order order = context.getExtendedState().get("order", Order.class);
        return order.getItems().stream()
            .allMatch(item -> item.getQuantity() <= item.getAvailableQuantity());
    }
}
```

### 3. 状态机错误处理
```java
@Configuration
public class StateMachineErrorConfig {
    
    @Bean
    public StateMachineErrorHandler<OrderState, OrderEvent> errorHandler() {
        return new DefaultStateMachineErrorHandler() {
            @Override
            public void handle(StateMachine<OrderState, OrderEvent> stateMachine, 
                    Exception exception) {
                if (exception instanceof StateMachineException) {
                    // 处理状态机异常
                    log.error("状态机异常: {}", exception.getMessage());
                } else {
                    // 处理其他异常
                    log.error("未知异常: {}", exception.getMessage());
                }
            }
        };
    }
}
```

## 练习

1. 基础状态机实践：
   - 实现状态机配置
   - 实现状态机服务
   - 实现状态监听器

2. 高级特性实践：
   - 实现状态机动作
   - 实现状态机守卫
   - 实现错误处理

3. 持久化实践：
   - 实现状态持久化
   - 实现状态恢复
   - 实现状态历史

4. 集成实践：
   - 集成消息队列
   - 集成定时任务
   - 集成监控系统

::: tip
Spring Statemachine 提供了强大的状态机实现，适合处理复杂的业务流程和状态转换。
:::

::: info 扩展阅读
- [Spring Statemachine 官方文档](https://docs.spring.io/spring-statemachine/docs/current/reference/)
- [状态机模式](https://refactoring.guru/design-patterns/state)
- [Spring Statemachine 示例](https://github.com/spring-projects/spring-statemachine/tree/main/spring-statemachine-samples)
::: 