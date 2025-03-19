---
title: Spring 框架
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 框架
date: 2024-03-19
---

# Spring 框架

## Spring 核心

### 1. IoC 容器
```java
public class IoCExample {
    // 1. 配置类
    @Configuration
    public class AppConfig {
        @Bean
        public UserService userService() {
            return new UserServiceImpl();
        }
        
        @Bean
        public UserDao userDao() {
            return new UserDaoImpl();
        }
    }
    
    // 2. 组件扫描
    @Component
    public class UserServiceImpl implements UserService {
        @Autowired
        private UserDao userDao;
        
        @Override
        public void save() {
            userDao.save();
        }
    }
    
    // 3. 依赖注入
    public class UserController {
        @Autowired
        private UserService userService;
        
        @Resource
        private UserDao userDao;
        
        @Inject
        private OrderService orderService;
    }
}
```

### 2. AOP 编程
```java
public class AOPExample {
    // 1. 切面
    @Aspect
    @Component
    public class LogAspect {
        @Before("execution(* com.example.service.*.*(..))")
        public void before(JoinPoint joinPoint) {
            System.out.println("Before: " + joinPoint.getSignature().getName());
        }
        
        @After("execution(* com.example.service.*.*(..))")
        public void after(JoinPoint joinPoint) {
            System.out.println("After: " + joinPoint.getSignature().getName());
        }
        
        @Around("execution(* com.example.service.*.*(..))")
        public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
            System.out.println("Around before");
            Object result = joinPoint.proceed();
            System.out.println("Around after");
            return result;
        }
    }
    
    // 2. 目标类
    @Service
    public class UserServiceImpl implements UserService {
        @Override
        public void save() {
            System.out.println("Saving user");
        }
    }
}
```

### 3. 事务管理
```java
public class TransactionExample {
    @Service
    public class OrderServiceImpl implements OrderService {
        @Autowired
        private OrderDao orderDao;
        
        @Autowired
        private UserDao userDao;
        
        @Transactional(rollbackFor = Exception.class)
        public void createOrder(Order order) {
            // 1. 创建订单
            orderDao.save(order);
            
            // 2. 更新用户余额
            userDao.updateBalance(order.getUserId(), order.getAmount());
            
            // 3. 如果发生异常，事务会回滚
        }
    }
}
```

## Spring MVC

### 1. 控制器
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
    
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user);
    }
    
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

### 2. 数据绑定
```java
public class DataBindingExample {
    @Controller
    public class FormController {
        @GetMapping("/form")
        public String showForm(Model model) {
            model.addAttribute("user", new User());
            return "form";
        }
        
        @PostMapping("/form")
        public String submitForm(@ModelAttribute User user) {
            // 处理表单数据
            return "success";
        }
        
        @GetMapping("/search")
        public String search(@RequestParam(defaultValue = "") String keyword) {
            // 处理搜索参数
            return "results";
        }
    }
}
```

### 3. 视图解析
```java
public class ViewResolverExample {
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void configureViewResolvers(ViewResolverRegistry registry) {
            // 配置视图解析器
            registry.jsp("/WEB-INF/views/", ".jsp");
        }
        
        @Override
        public void addViewControllers(ViewControllerRegistry registry) {
            // 配置视图控制器
            registry.addViewController("/").setViewName("home");
        }
    }
}
```

## Spring Boot

### 1. 自动配置
```java
public class AutoConfigExample {
    // 1. 启动类
    @SpringBootApplication
    public class Application {
        public static void main(String[] args) {
            SpringApplication.run(Application.class, args);
        }
    }
    
    // 2. 配置文件
    // application.properties
    spring.datasource.url=jdbc:mysql://localhost:3306/test
    spring.datasource.username=root
    spring.datasource.password=password
    
    // 3. 自定义配置
    @Configuration
    @ConditionalOnProperty(name = "app.feature.enabled", havingValue = "true")
    public class CustomConfig {
        @Bean
        public CustomService customService() {
            return new CustomServiceImpl();
        }
    }
}
```

### 2. 依赖管理
```xml
<!-- pom.xml -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.0</version>
</parent>

<dependencies>
    <!-- Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Data -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
</dependencies>
```

### 3. 监控管理
```java
public class ActuatorExample {
    // 1. 添加依赖
    // <dependency>
    //     <groupId>org.springframework.boot</groupId>
    //     <artifactId>spring-boot-starter-actuator</artifactId>
    // </dependency>
    
    // 2. 配置端点
    // application.properties
    management.endpoints.web.exposure.include=health,info,metrics
    management.endpoint.health.show-details=always
    
    // 3. 自定义端点
    @Component
    @Endpoint(id = "custom")
    public class CustomEndpoint {
        @ReadOperation
        public Map<String, Object> custom() {
            Map<String, Object> map = new HashMap<>();
            map.put("status", "UP");
            return map;
        }
    }
}
```

## 练习

1. Spring 核心实践：
   - 实现依赖注入
   - 实现 AOP 切面
   - 实现事务管理

2. Spring MVC 实践：
   - 实现 RESTful API
   - 实现表单处理
   - 实现文件上传

3. Spring Boot 实践：
   - 创建 Spring Boot 项目
   - 配置数据库连接
   - 实现安全认证

4. 综合实践：
   - 实现用户管理系统
   - 实现订单管理系统
   - 实现博客系统

::: tip
Spring 框架提供了丰富的功能，建议根据实际需求选择合适的组件使用。
:::

::: info 扩展阅读
- [Spring 官方文档](https://docs.spring.io/spring-framework/docs/current/reference/html/)
- [Spring Boot 官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/)
::: 