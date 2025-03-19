---
title: Spring Native
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - Native
date: 2024-03-19
---

# Spring Native

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
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.experimental</groupId>
        <artifactId>spring-native</artifactId>
        <version>0.12.1</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.experimental</groupId>
            <artifactId>spring-aot-maven-plugin</artifactId>
            <version>0.12.1</version>
            <executions>
                <execution>
                    <id>generate</id>
                    <goals>
                        <goal>generate</goal>
                    </goals>
                    <phase>prepare-package</phase>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

### 2. 反射配置
```json
{
  "name": "com.example.demo",
  "allDeclaredConstructors": true,
  "allPublicConstructors": true,
  "allDeclaredMethods": true,
  "allPublicMethods": true,
  "allDeclaredFields": true,
  "allPublicFields": true
}
```

### 3. 资源访问配置
```java
@Configuration
public class ResourceConfig {
    
    @Bean
    public ResourcePatternResolver resourcePatternResolver() {
        return new PathMatchingResourcePatternResolver();
    }
    
    @Bean
    public ResourceLoader resourceLoader() {
        return new DefaultResourceLoader();
    }
}
```

## 性能优化

### 1. 编译优化
```java
@Configuration
public class CompilationConfig {
    
    @Bean
    public CompilationHints compilationHints() {
        CompilationHints hints = new CompilationHints();
        hints.setReflection(true);
        hints.setResources(true);
        hints.setSerialization(true);
        return hints;
    }
}
```

### 2. 内存优化
```java
@Configuration
public class MemoryConfig {
    
    @Bean
    public MemoryManager memoryManager() {
        MemoryManager manager = new MemoryManager();
        manager.setMaxHeapSize("512m");
        manager.setMinHeapSize("256m");
        return manager;
    }
}
```

### 3. 启动优化
```java
@SpringBootApplication
public class Application {
    
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Application.class);
        app.setDefaultProperties(Collections.singletonMap(
            "spring.aot.enabled", "true"));
        app.run(args);
    }
}
```

## 功能适配

### 1. 动态代理
```java
@Configuration
public class ProxyConfig {
    
    @Bean
    public ProxyFactory proxyFactory() {
        ProxyFactory factory = new ProxyFactory();
        factory.setOptimize(true);
        factory.setProxyTargetClass(true);
        return factory;
    }
}
```

### 2. 序列化
```java
@Configuration
public class SerializationConfig {
    
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}
```

### 3. 资源加载
```java
@Component
public class ResourceLoader {
    
    @Autowired
    private ResourcePatternResolver resourcePatternResolver;
    
    public Resource[] loadResources(String pattern) throws IOException {
        return resourcePatternResolver.getResources(pattern);
    }
    
    public InputStream loadResourceAsStream(String location) throws IOException {
        Resource resource = resourcePatternResolver.getResource(location);
        return resource.getInputStream();
    }
}
```

## 部署配置

### 1. Docker 配置
```dockerfile
FROM ghcr.io/graalvm/graalvm-community:latest AS builder
WORKDIR /app
COPY . .
RUN ./mvnw -Pnative clean package

FROM scratch
COPY --from=builder /app/target/demo /app
ENTRYPOINT ["/app"]
```

### 2. 构建配置
```yaml
build:
  plugins:
    - name: native
      version: 0.12.1
      configuration:
        buildArgs:
          - --no-fallback
          - --initialize-at-build-time=org.slf4j.LoggerFactory
          - --initialize-at-run-time=io.netty.channel.unix.Socket
          - --initialize-at-run-time=io.netty.channel.unix.IovArray
          - --initialize-at-run-time=io.netty.channel.epoll.EpollEventArray
          - --initialize-at-run-time=io.netty.channel.epoll.Native
```

### 3. 运行配置
```properties
spring.native.mode=reflect
spring.native.build-time-properties=true
spring.native.remove-yaml-support=true
```

## 练习

1. 基础配置实践：
   - 配置项目依赖
   - 配置反射访问
   - 配置资源加载

2. 性能优化实践：
   - 实现编译优化
   - 实现内存优化
   - 实现启动优化

3. 功能适配实践：
   - 实现动态代理
   - 实现序列化
   - 实现资源加载

4. 部署实践：
   - 实现 Docker 部署
   - 实现构建配置
   - 实现运行配置

::: tip
Spring Native 提供了将 Spring 应用编译为本地镜像的能力，可以显著提升启动速度和减少内存占用。
:::

::: info 扩展阅读
- [Spring Native 官方文档](https://docs.spring.io/spring-native/docs/current/reference/htmlsingle/)
- [GraalVM 官方文档](https://www.graalvm.org/docs/)
- [Spring Native 示例](https://github.com/spring-projects-experimental/spring-native/tree/main/samples)
::: 