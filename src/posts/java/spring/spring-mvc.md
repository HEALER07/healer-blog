---
title: Spring MVC 详解
icon: java
order: 5
category:
  - Java
tag:
  - java
  - Spring
  - Web
date: 2024-03-24
---

# Spring MVC 详解

## 1. Spring MVC 简介

Spring MVC 是 Spring Framework 的一个模块，实现了 Model-View-Controller (MVC) 架构，用于开发灵活、松耦合的 Web 应用程序。

### 1.1 主要特点

- 清晰的角色划分
- 灵活的配置
- 强大的功能扩展
- 优秀的 RESTful 支持
- 简单的异常处理
- 方便的表单处理和数据验证

## 2. Spring MVC 架构

### 2.1 核心组件

1. **DispatcherServlet**：前端控制器，处理所有请求
2. **HandlerMapping**：处理器映射，映射请求到处理器
3. **Controller**：处理器，处理业务逻辑
4. **ModelAndView**：封装模型和视图信息
5. **ViewResolver**：视图解析器，解析视图

### 2.2 请求处理流程

```plaintext
请求 -> DispatcherServlet -> HandlerMapping -> Controller 
-> ModelAndView -> ViewResolver -> View -> 响应
```

## 3. Controller 详解

### 3.1 基本用法

```java
@Controller
@RequestMapping("/user")
public class UserController {
    
    @GetMapping("/{id}")
    public String getUser(@PathVariable Long id, Model model) {
        User user = userService.getUser(id);
        model.addAttribute("user", user);
        return "user/detail";
    }
    
    @PostMapping
    public String createUser(@Valid @RequestBody User user) {
        userService.createUser(user);
        return "redirect:/user/list";
    }
}
```

### 3.2 常用注解

- **@Controller**：标识控制器类
- **@RestController**：@Controller + @ResponseBody
- **@RequestMapping**：映射请求
- **@GetMapping**：处理 GET 请求
- **@PostMapping**：处理 POST 请求
- **@PathVariable**：获取 URL 路径变量
- **@RequestParam**：获取请求参数
- **@RequestBody**：获取请求体
- **@ResponseBody**：返回响应体

## 4. 数据绑定和验证

### 4.1 数据绑定

```java
@Controller
public class UserController {
    
    @PostMapping("/user")
    public String handleSubmit(@ModelAttribute User user) {
        // 处理提交的用户数据
        return "success";
    }
    
    @ModelAttribute
    public void populateModel(@RequestParam String userId, Model model) {
        model.addAttribute("user", userService.getUser(userId));
    }
}
```

### 4.2 数据验证

```java
public class User {
    @NotNull
    @Size(min = 2, max = 30)
    private String name;
    
    @NotNull
    @Email
    private String email;
    
    // getters and setters
}

@Controller
public class UserController {
    
    @PostMapping("/user")
    public String createUser(@Valid User user, BindingResult result) {
        if (result.hasErrors()) {
            return "user/form";
        }
        userService.save(user);
        return "redirect:/users";
    }
}
```

## 5. 视图解析

### 5.1 ViewResolver 配置

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
}
```

### 5.2 常用视图类型

- JSP
- Thymeleaf
- FreeMarker
- Velocity
- PDF/Excel

## 6. RESTful Web 服务

### 6.1 REST 控制器

```java
@RestController
@RequestMapping("/api/users")
public class UserRestController {
    
    @GetMapping
    public List<User> listUsers() {
        return userService.findAll();
    }
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@Valid @RequestBody User user) {
        return userService.save(user);
    }
    
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

### 6.2 响应状态码

```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
    }
}
```

## 7. 文件上传

### 7.1 配置文件上传解析器

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Bean
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
        resolver.setMaxUploadSize(5242880); // 5MB
        return resolver;
    }
}
```

### 7.2 处理文件上传

```java
@Controller
public class FileUploadController {
    
    @PostMapping("/upload")
    public String handleFileUpload(@RequestParam("file") MultipartFile file) {
        if (!file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
                Path path = Paths.get("uploads/" + file.getOriginalFilename());
                Files.write(path, bytes);
                return "redirect:/success";
            } catch (IOException e) {
                return "redirect:/error";
            }
        }
        return "redirect:/error";
    }
}
```

## 8. 异常处理

### 8.1 @ExceptionHandler

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred"
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

## 9. 拦截器

### 9.1 自定义拦截器

```java
public class LoggingInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) throws Exception {
        log.info("Before handling the request");
        return true;
    }
    
    @Override
    public void postHandle(HttpServletRequest request, 
                         HttpServletResponse response, 
                         Object handler, 
                         ModelAndView modelAndView) throws Exception {
        log.info("After handling the request");
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, 
                              HttpServletResponse response, 
                              Object handler, 
                              Exception ex) throws Exception {
        log.info("After completing request");
    }
}
```

### 9.2 注册拦截器

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoggingInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/admin/**");
    }
}
```

## 10. 最佳实践

1. **使用合适的注解**：选择最适合场景的注解
2. **RESTful API 设计**：遵循 REST 原则设计 API
3. **统一异常处理**：实现全局异常处理
4. **参数验证**：使用验证注解确保数据有效性
5. **日志记录**：合理使用日志记录请求和异常
6. **安全性考虑**：实施必要的安全措施

## 11. 总结

Spring MVC 提供了强大而灵活的 Web 开发框架，通过合理使用其特性，可以构建出高质量的 Web 应用。掌握这些核心概念和最佳实践，对于开发现代 Web 应用至关重要。 