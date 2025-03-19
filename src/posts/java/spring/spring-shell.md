---
title: Spring Shell
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - Shell
date: 2024-03-19
---

# Spring Shell

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
        <groupId>org.springframework.shell</groupId>
        <artifactId>spring-shell-starter</artifactId>
        <version>3.2.0</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
</dependencies>
```

### 2. Shell 配置
```java
@Configuration
public class ShellConfig {
    
    @Bean
    public CommandRegistry commandRegistry() {
        return new CommandRegistry();
    }
    
    @Bean
    public ShellPromptProvider shellPromptProvider() {
        return () -> new AttributedString("demo-shell:>", 
            AttributedStyle.DEFAULT.foreground(AttributedStyle.GREEN));
    }
    
    @Bean
    public History history() {
        return new DefaultHistory();
    }
}
```

### 3. 命令组配置
```java
@ShellComponent
@ShellCommandGroup("用户管理")
public class UserCommands {
    
    @Autowired
    private UserService userService;
    
    @ShellMethod("创建用户")
    public String createUser(String username, String email) {
        User user = new User(username, email);
        userService.save(user);
        return "用户创建成功: " + username;
    }
    
    @ShellMethod("查询用户")
    public String findUser(String username) {
        return userService.findByUsername(username)
            .map(user -> String.format("用户: %s, 邮箱: %s", 
                user.getUsername(), user.getEmail()))
            .orElse("用户不存在");
    }
}
```

## 命令实现

### 1. 基本命令
```java
@ShellComponent
public class BasicCommands {
    
    @ShellMethod("显示帮助信息")
    public String help() {
        return "可用命令:\n" +
               "  help - 显示帮助信息\n" +
               "  clear - 清屏\n" +
               "  exit - 退出程序";
    }
    
    @ShellMethod("清屏")
    public void clear() {
        System.out.print("\033[H\033[2J");
        System.out.flush();
    }
    
    @ShellMethod("退出程序")
    public void exit() {
        System.exit(0);
    }
}
```

### 2. 参数命令
```java
@ShellComponent
public class ParameterCommands {
    
    @ShellMethod(value = "计算两个数的和", key = "add")
    public int add(
        @ShellOption(help = "第一个数") int a,
        @ShellOption(help = "第二个数") int b
    ) {
        return a + b;
    }
    
    @ShellMethod(value = "格式化字符串", key = "format")
    public String format(
        @ShellOption(help = "格式字符串") String pattern,
        @ShellOption(help = "参数列表") String... args
    ) {
        return String.format(pattern, (Object[]) args);
    }
}
```

### 3. 交互命令
```java
@ShellComponent
public class InteractiveCommands {
    
    @Autowired
    private LineReader lineReader;
    
    @ShellMethod("交互式创建用户")
    public String createUserInteractive() {
        String username = lineReader.readLine("请输入用户名: ");
        String email = lineReader.readLine("请输入邮箱: ");
        String password = lineReader.readLine("请输入密码: ", '*');
        
        // 创建用户逻辑
        return "用户创建成功: " + username;
    }
}
```

## 高级特性

### 1. 命令历史
```java
@ShellComponent
public class HistoryCommands {
    
    @Autowired
    private History history;
    
    @ShellMethod("显示命令历史")
    public String showHistory() {
        StringBuilder sb = new StringBuilder();
        history.forEach(entry -> 
            sb.append(entry.index()).append(": ")
              .append(entry.line()).append("\n"));
        return sb.toString();
    }
    
    @ShellMethod("执行历史命令")
    public String executeHistory(int index) {
        return history.get(index)
            .map(entry -> "执行命令: " + entry.line())
            .orElse("命令不存在");
    }
}
```

### 2. 命令补全
```java
@ShellComponent
public class CompletionCommands {
    
    @Autowired
    private UserService userService;
    
    @ShellMethod("删除用户")
    public String deleteUser(String username) {
        userService.deleteByUsername(username);
        return "用户删除成功: " + username;
    }
    
    @ShellMethodAvailability("deleteUser")
    public Availability deleteUserAvailability() {
        return userService.count() > 0
            ? Availability.available()
            : Availability.unavailable("没有可删除的用户");
    }
}
```

### 3. 命令验证
```java
@ShellComponent
public class ValidationCommands {
    
    @ShellMethod("创建用户")
    public String createUser(
        @Pattern(regexp = "^[a-zA-Z0-9]{4,16}$", message = "用户名必须是4-16位字母或数字")
        String username,
        @Email(message = "邮箱格式不正确")
        String email
    ) {
        // 创建用户逻辑
        return "用户创建成功: " + username;
    }
}
```

## 练习

1. 基础命令实践：
   - 实现基本命令
   - 实现参数命令
   - 实现交互命令

2. 高级特性实践：
   - 实现命令历史
   - 实现命令补全
   - 实现命令验证

3. 功能扩展实践：
   - 实现自定义提示符
   - 实现命令别名
   - 实现命令分组

4. 集成实践：
   - 集成数据库操作
   - 集成文件操作
   - 集成网络操作

::: tip
Spring Shell 提供了强大的命令行交互能力，适合开发管理工具和运维工具。
:::

::: info 扩展阅读
- [Spring Shell 官方文档](https://docs.spring.io/spring-shell/docs/current/reference/htmlsingle/)
- [JLine 官方文档](https://github.com/jline/jline3)
- [Spring Shell 示例](https://github.com/spring-projects/spring-shell/tree/main/spring-shell-examples)
::: 