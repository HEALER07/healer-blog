---
title: Spring WebFlux
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 响应式编程
date: 2024-03-19
---

# Spring WebFlux

## 基础配置

### 1. WebFlux 配置
```java
@Configuration
@EnableWebFlux
public class WebFluxConfig implements WebFluxConfigurer {
    
    @Override
    public void configureHttpMessageCodecs(ServerCodecConfigurer configurer) {
        configurer.defaultCodecs()
            .jackson2JsonDecoder(new Jackson2JsonDecoder())
            .jackson2JsonEncoder(new Jackson2JsonEncoder());
    }
    
    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        registry.freeMarker();
    }
    
    @Bean
    public ReactiveWebServerFactory reactiveWebServerFactory() {
        return new NettyReactiveWebServerFactory();
    }
}
```

### 2. 路由配置
```java
@Configuration
public class RouterConfig {
    
    @Bean
    public RouterFunction<ServerResponse> routes(UserHandler userHandler) {
        return RouterFunctions
            .route(GET("/users"), userHandler::getUsers)
            .andRoute(GET("/users/{id}"), userHandler::getUser)
            .andRoute(POST("/users"), userHandler::createUser)
            .andRoute(PUT("/users/{id}"), userHandler::updateUser)
            .andRoute(DELETE("/users/{id}"), userHandler::deleteUser);
    }
}
```

### 3. 异常处理
```java
@Configuration
public class ExceptionConfig {
    
    @Bean
    public WebExceptionHandler webExceptionHandler() {
        return (ServerWebExchange exchange, Throwable ex) -> {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            return response.writeWith(
                Mono.just(response.bufferFactory().wrap(
                    ex.getMessage().getBytes()
                ))
            );
        };
    }
}
```

## 控制器

### 1. REST 控制器
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public Flux<User> getUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    public Mono<User> getUser(@PathVariable String id) {
        return userService.findById(id);
    }
    
    @PostMapping
    public Mono<User> createUser(@RequestBody User user) {
        return userService.save(user);
    }
    
    @PutMapping("/{id}")
    public Mono<User> updateUser(
            @PathVariable String id,
            @RequestBody User user) {
        return userService.update(id, user);
    }
    
    @DeleteMapping("/{id}")
    public Mono<Void> deleteUser(@PathVariable String id) {
        return userService.delete(id);
    }
}
```

### 2. 函数式端点
```java
@Component
public class UserHandler {
    
    @Autowired
    private UserService userService;
    
    public Mono<ServerResponse> getUsers(ServerRequest request) {
        return ServerResponse.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(userService.findAll(), User.class);
    }
    
    public Mono<ServerResponse> getUser(ServerRequest request) {
        String id = request.pathVariable("id");
        return userService.findById(id)
            .flatMap(user -> ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(user))
            .switchIfEmpty(ServerResponse.notFound().build());
    }
    
    public Mono<ServerResponse> createUser(ServerRequest request) {
        return request.bodyToMono(User.class)
            .flatMap(user -> userService.save(user))
            .flatMap(savedUser -> ServerResponse.created(
                URI.create("/api/users/" + savedUser.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(savedUser));
    }
}
```

## 数据访问

### 1. R2DBC 配置
```java
@Configuration
public class R2dbcConfig {
    
    @Bean
    public ConnectionFactory connectionFactory() {
        return PostgresqlConnectionFactory.from(
            PostgresqlConnectionConfiguration.builder()
                .host("localhost")
                .port(5432)
                .database("testdb")
                .username("postgres")
                .password("password")
                .build()
        );
    }
    
    @Bean
    public R2dbcEntityTemplate r2dbcEntityTemplate(
            ConnectionFactory connectionFactory) {
        return new R2dbcEntityTemplate(connectionFactory);
    }
}
```

### 2. 响应式仓库
```java
@Repository
public interface UserRepository extends ReactiveCrudRepository<User, String> {
    Flux<User> findByUsername(String username);
    
    Mono<User> findByEmail(String email);
    
    @Query("SELECT * FROM users WHERE age > :age")
    Flux<User> findUsersOlderThan(@Param("age") int age);
}
```

### 3. 服务层实现
```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public Flux<User> findAll() {
        return userRepository.findAll();
    }
    
    public Mono<User> findById(String id) {
        return userRepository.findById(id);
    }
    
    public Mono<User> save(User user) {
        return userRepository.save(user);
    }
    
    public Mono<User> update(String id, User user) {
        return userRepository.findById(id)
            .flatMap(existingUser -> {
                existingUser.setUsername(user.getUsername());
                existingUser.setEmail(user.getEmail());
                return userRepository.save(existingUser);
            });
    }
    
    public Mono<Void> delete(String id) {
        return userRepository.deleteById(id);
    }
}
```

## 高级特性

### 1. WebSocket 支持
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOrigins("*")
            .withSockJS();
    }
}
```

### 2. SSE 支持
```java
@RestController
@RequestMapping("/api/events")
public class EventController {
    
    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamEvents() {
        return Flux.interval(Duration.ofSeconds(1))
            .map(sequence -> ServerSentEvent.<String>builder()
                .data("SSE Event #" + sequence)
                .id(String.valueOf(sequence))
                .event("periodic-event")
                .build());
    }
}
```

### 3. 响应式缓存
```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public ReactiveCacheManager cacheManager() {
        SimpleReactiveCacheManager cacheManager = 
            new SimpleReactiveCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapReactiveCache("users"),
            new ConcurrentMapReactiveCache("orders")
        ));
        return cacheManager;
    }
}
```

## 练习

1. 基础 WebFlux 实践：
   - 实现 REST 接口
   - 实现函数式端点
   - 实现数据访问

2. 高级特性实践：
   - 实现 WebSocket
   - 实现 SSE
   - 实现响应式缓存

3. 性能实践：
   - 实现背压处理
   - 实现并发控制
   - 实现超时处理

4. 测试实践：
   - 实现单元测试
   - 实现集成测试
   - 实现性能测试

::: tip
响应式编程需要考虑背压、并发和资源管理，建议根据实际需求选择合适的响应式组件。
:::

::: info 扩展阅读
- [Spring WebFlux 官方文档](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html)
- [Project Reactor 官方文档](https://projectreactor.io/docs/core/release/reference/)
- [Spring WebFlux 示例](https://github.com/spring-projects/spring-framework/tree/main/spring-webmvc/src/test/java/org/springframework/web/reactive)
::: 