---
title: Spring Core 核心概念
icon: leaf
order: 1
category:
  - Java
tag:
  - Spring
  - 框架
date: 2024-03-24
---

# Spring Core 核心概念

## 1. Spring Framework 概述

Spring Framework 是一个开源的 Java 平台，为创建高性能、易测试、可重用的代码提供了全面的编程和配置模型。

### 1.1 核心特性

- **IoC容器**：管理对象的创建和依赖关系
- **AOP支持**：面向切面编程的实现
- **数据访问**：简化数据库操作
- **事务管理**：提供声明式事务支持
- **MVC框架**：用于构建Web应用
- **认证和授权**：通过Spring Security实现
- **远程调用**：支持多种远程调用方式

## 2. IoC (控制反转)

### 2.1 什么是IoC

IoC（Inversion of Control）是一种设计原则，它将传统上由程序代码直接操控的对象的调用权交给容器，通过容器来实现对象组件的装配和管理。

### 2.2 IoC容器的实现

Spring提供了两种IoC容器：
- BeanFactory
- ApplicationContext

```java
// 创建IoC容器
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
// 获取Bean
UserService userService = context.getBean("userService", UserService.class);
```

### 2.3 依赖注入的方式

1. **构造器注入**
```java
@Component
public class UserService {
    private final UserRepository userRepository;
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

2. **Setter注入**
```java
@Component
public class UserService {
    private UserRepository userRepository;
    
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

3. **字段注入**
```java
@Component
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```

## 3. AOP (面向切面编程)

### 3.1 AOP概念

AOP（Aspect-Oriented Programming）允许程序模块化横切关注点，如事务管理、日志记录、安全等。

### 3.2 核心概念

- **切面（Aspect）**：横切关注点的模块化
- **连接点（Join Point）**：程序执行的某个特定位置
- **通知（Advice）**：在切面的某个特定连接点上执行的动作
- **切入点（Pointcut）**：匹配连接点的规则
- **引入（Introduction）**：向现有的类添加新方法或属性

### 3.3 实现示例

```java
@Aspect
@Component
public class LoggingAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Before method: " + joinPoint.getSignature().getName());
    }
    
    @After("execution(* com.example.service.*.*(..))")
    public void logAfter(JoinPoint joinPoint) {
        System.out.println("After method: " + joinPoint.getSignature().getName());
    }
}
```

## 4. Spring Bean

### 4.1 Bean的生命周期

1. 实例化
2. 属性赋值
3. 初始化
4. 销毁

### 4.2 Bean的作用域

- singleton（默认）
- prototype
- request
- session
- application
- websocket

### 4.3 Bean的配置方式

1. **XML配置**
```xml
<bean id="userService" class="com.example.service.UserService">
    <property name="userRepository" ref="userRepository"/>
</bean>
```

2. **注解配置**
```java
@Configuration
public class AppConfig {
    @Bean
    public UserService userService() {
        return new UserService();
    }
}
```

## 5. Spring 事务管理

### 5.1 事务特性（ACID）

- 原子性（Atomicity）
- 一致性（Consistency）
- 隔离性（Isolation）
- 持久性（Durability）

### 5.2 声明式事务

```java
@Service
public class UserService {
    @Transactional
    public void createUser(User user) {
        // 业务逻辑
    }
}
```

### 5.3 事务传播行为

- REQUIRED（默认）
- SUPPORTS
- MANDATORY
- REQUIRES_NEW
- NOT_SUPPORTED
- NEVER
- NESTED

## 6. 最佳实践

### 6.1 依赖注入最佳实践

- 优先使用构造器注入
- 使用final字段
- 避免使用字段注入

### 6.2 AOP最佳实践

- 使用切面处理横切关注点
- 合理使用切入点表达式
- 避免过度使用AOP

### 6.3 配置最佳实践

- 使用Java配置替代XML配置
- 合理使用组件扫描
- 遵循约定优于配置原则

## 7. 总结

Spring Framework 提供了强大的企业级应用开发支持，通过IoC和AOP等核心特性，帮助开发者构建松耦合、易测试的应用程序。掌握这些核心概念对于开发高质量的Java应用至关重要。 