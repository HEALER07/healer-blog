---
title: Spring Cloud
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 微服务
date: 2024-03-19
---

# Spring Cloud

## 服务注册与发现

### 1. Eureka 服务注册中心
```java
// 1. 服务端配置
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}

// 2. 客户端配置
@SpringBootApplication
@EnableDiscoveryClient
public class ServiceClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServiceClientApplication.class, args);
    }
}

// 3. 配置文件
server:
  port: 8761
spring:
  application:
    name: eureka-server
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    wait-time-in-ms-when-sync-empty: 0
```

### 2. Nacos 服务注册中心
```java
// 1. 服务端配置
@SpringBootApplication
@EnableDiscoveryClient
public class NacosServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosServerApplication.class, args);
    }
}

// 2. 客户端配置
@SpringBootApplication
@EnableDiscoveryClient
public class NacosClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosClientApplication.class, args);
    }
}

// 3. 配置文件
spring:
  application:
    name: nacos-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
```

## 服务调用

### 1. Ribbon 负载均衡
```java
// 1. 配置类
@Configuration
public class RibbonConfig {
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

// 2. 服务调用
@Service
public class UserService {
    @Autowired
    private RestTemplate restTemplate;
    
    public User getUser(Long id) {
        return restTemplate.getForObject(
            "http://user-service/users/{id}",
            User.class,
            id
        );
    }
}
```

### 2. Feign 声明式调用
```java
// 1. 接口定义
@FeignClient(name = "user-service")
public interface UserFeignClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable("id") Long id);
    
    @PostMapping("/users")
    User createUser(@RequestBody User user);
}

// 2. 服务调用
@Service
public class UserService {
    @Autowired
    private UserFeignClient userFeignClient;
    
    public User getUser(Long id) {
        return userFeignClient.getUser(id);
    }
}
```

## 服务熔断与降级

### 1. Hystrix 熔断器
```java
// 1. 服务降级
@Service
public class UserService {
    @HystrixCommand(fallbackMethod = "getUserFallback")
    public User getUser(Long id) {
        return userFeignClient.getUser(id);
    }
    
    public User getUserFallback(Long id) {
        return new User(id, "fallback");
    }
}

// 2. 熔断配置
@Configuration
public class HystrixConfig {
    @Bean
    public HystrixCommand.Setter setter() {
        return HystrixCommand.Setter
            .withGroupKey(HystrixCommandGroupKey.Factory.asKey("user-service"))
            .andCommandKey(HystrixCommandKey.Factory.asKey("getUser"))
            .andThreadPoolKey(HystrixThreadPoolKey.Factory.asKey("user-pool"))
            .andCommandPropertiesDefaults(
                HystrixCommandProperties.Setter()
                    .withCircuitBreakerRequestVolumeThreshold(10)
                    .withCircuitBreakerErrorThresholdPercentage(50)
                    .withCircuitBreakerSleepWindowInMilliseconds(5000)
            );
    }
}
```

### 2. Sentinel 熔断器
```java
// 1. 服务降级
@Service
public class UserService {
    @SentinelResource(value = "getUser", blockHandler = "handleBlock")
    public User getUser(Long id) {
        return userFeignClient.getUser(id);
    }
    
    public User handleBlock(Long id, BlockException ex) {
        return new User(id, "blocked");
    }
}

// 2. 熔断配置
@Configuration
public class SentinelConfig {
    @PostConstruct
    public void init() {
        FlowRule rule = new FlowRule();
        rule.setResource("getUser");
        rule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        rule.setCount(20);
        FlowRuleManager.loadRules(Collections.singletonList(rule));
    }
}
```

## 配置中心

### 1. Config 配置中心
```java
// 1. 服务端配置
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}

// 2. 客户端配置
@SpringBootApplication
@EnableConfigServer
public class ConfigClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigClientApplication.class, args);
    }
}

// 3. 配置文件
spring:
  config:
    import: optional:configserver:http://localhost:8888
```

### 2. Nacos 配置中心
```java
// 1. 配置类
@Configuration
@EnableConfigurationProperties
public class NacosConfig {
    @Value("${user.name}")
    private String userName;
    
    @Value("${user.age}")
    private Integer userAge;
}

// 2. 配置文件
spring:
  cloud:
    nacos:
      config:
        server-addr: localhost:8848
        file-extension: yaml
```

## 网关

### 1. Zuul 网关
```java
// 1. 网关配置
@SpringBootApplication
@EnableZuulProxy
public class ZuulGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }
}

// 2. 路由配置
zuul:
  routes:
    user-service:
      path: /api/users/**
      serviceId: user-service
    order-service:
      path: /api/orders/**
      serviceId: order-service
```

### 2. Gateway 网关
```java
// 1. 网关配置
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}

// 2. 路由配置
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
```

## 练习

1. 服务注册实践：
   - 实现 Eureka 服务注册
   - 实现 Nacos 服务注册
   - 实现服务健康检查

2. 服务调用实践：
   - 实现 Ribbon 负载均衡
   - 实现 Feign 声明式调用
   - 实现服务降级

3. 熔断降级实践：
   - 实现 Hystrix 熔断
   - 实现 Sentinel 熔断
   - 实现熔断监控

4. 配置中心实践：
   - 实现 Config 配置中心
   - 实现 Nacos 配置中心
   - 实现配置刷新

5. 网关实践：
   - 实现 Zuul 网关
   - 实现 Gateway 网关
   - 实现路由过滤

::: tip
微服务架构需要考虑服务治理、监控、安全等多个方面，建议根据实际需求选择合适的组件。
:::

::: info 扩展阅读
- [Spring Cloud 官方文档](https://spring.io/projects/spring-cloud)
- [Nacos 官方文档](https://nacos.io/zh-cn/docs/what-is-nacos.html)
- [Sentinel 官方文档](https://sentinelguard.io/zh-cn/docs/introduction.html)
::: 