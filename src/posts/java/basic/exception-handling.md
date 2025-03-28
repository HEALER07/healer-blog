---
title: Java 异常处理
icon: java
category:
  - Java 核心
tag:
  - Java
  - 异常
  - 错误处理
date: 2021-03-19
---

# Java 异常处理

## 异常概述

异常（Exception）是程序运行过程中出现的错误或异常情况。Java 中的异常分为：

- 检查型异常（Checked Exceptions）
- 非检查型异常（Unchecked Exceptions）

### 1. 异常层次结构
```
Throwable
├── Error
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── ...
└── Exception
    ├── IOException
    ├── SQLException
    ├── RuntimeException
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   └── ...
    └── ...
```

### 2. 异常分类
```java
// 检查型异常
public class CheckedException extends Exception {
    public CheckedException(String message) {
        super(message);
    }
}

// 非检查型异常
public class UncheckedException extends RuntimeException {
    public UncheckedException(String message) {
        super(message);
    }
}
```

## 异常处理机制

### 1. try-catch 语句
```java
try {
    // 可能抛出异常的代码
    int result = divide(10, 0);
} catch (ArithmeticException e) {
    // 处理算术异常
    System.out.println("除数不能为零");
} catch (Exception e) {
    // 处理其他异常
    System.out.println("发生异常：" + e.getMessage());
} finally {
    // 总是执行的代码
    System.out.println("finally 块执行");
}
```

### 2. throws 关键字
```java
// 声明可能抛出的异常
public void readFile(String path) throws IOException {
    File file = new File(path);
    FileReader reader = new FileReader(file);
    // 读取文件
    reader.close();
}
```

### 3. throw 关键字
```java
// 抛出异常
public void validateAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("年龄不能为负数");
    }
}
```

## 自定义异常

### 1. 创建自定义异常
```java
public class BusinessException extends Exception {
    private String errorCode;
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}
```

### 2. 使用自定义异常
```java
public class UserService {
    public void registerUser(String username) throws BusinessException {
        if (username == null || username.trim().isEmpty()) {
            throw new BusinessException("用户名不能为空", "E001");
        }
        // 注册用户
    }
}
```

## 异常处理最佳实践

### 1. 异常处理原则
```java
public class ExceptionHandler {
    // 1. 只捕获需要的异常
    public void handleSpecificException() {
        try {
            // 可能抛出 IOException 的代码
        } catch (IOException e) {
            // 只处理 IOException
        }
    }
    
    // 2. 避免空的 catch 块
    public void avoidEmptyCatch() {
        try {
            // 可能抛出异常的代码
        } catch (Exception e) {
            // 记录异常
            logger.error("发生异常", e);
            // 或者重新抛出
            throw new RuntimeException("处理失败", e);
        }
    }
    
    // 3. 使用 finally 块清理资源
    public void cleanupResources() {
        FileReader reader = null;
        try {
            reader = new FileReader("file.txt");
            // 读取文件
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

### 2. 使用 try-with-resources
```java
// 自动关闭资源
try (FileReader reader = new FileReader("file.txt");
     BufferedReader bufferedReader = new BufferedReader(reader)) {
    String line;
    while ((line = bufferedReader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### 3. 异常链
```java
public class ServiceException extends Exception {
    public ServiceException(String message) {
        super(message);
    }
    
    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}

public class BusinessService {
    public void process() throws ServiceException {
        try {
            // 可能抛出 IOException 的代码
            readFile();
        } catch (IOException e) {
            // 包装异常
            throw new ServiceException("处理失败", e);
        }
    }
}
```

## 异常处理模式

### 1. 异常转换
```java
public class ExceptionTranslator {
    public void translateException() {
        try {
            // 调用可能抛出 SQLException 的方法
            databaseOperation();
        } catch (SQLException e) {
            // 转换为业务异常
            throw new BusinessException("数据库操作失败", e);
        }
    }
}
```

### 2. 异常恢复
```java
public class ExceptionRecovery {
    public void recoverFromException() {
        int maxRetries = 3;
        int retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                // 可能失败的操作
                performOperation();
                break;
            } catch (Exception e) {
                retryCount++;
                if (retryCount == maxRetries) {
                    throw new RuntimeException("操作失败", e);
                }
                // 等待一段时间后重试
                Thread.sleep(1000);
            }
        }
    }
}
```

### 3. 异常传播
```java
public class ExceptionPropagation {
    public void propagateException() throws BusinessException {
        try {
            // 调用可能抛出异常的方法
            method1();
            method2();
        } catch (Exception e) {
            // 包装并传播异常
            throw new BusinessException("操作失败", e);
        }
    }
}
```

## 常见问题

### 1. 异常处理陷阱
```java
public class ExceptionTraps {
    // 1. 捕获 Throwable
    public void catchThrowable() {
        try {
            // 代码
        } catch (Throwable t) {  // 不推荐
            t.printStackTrace();
        }
    }
    
    // 2. 忽略异常
    public void ignoreException() {
        try {
            // 代码
        } catch (Exception e) {
            // 空的 catch 块
        }
    }
    
    // 3. 在 finally 块中返回
    public int returnInFinally() {
        try {
            return 1;
        } finally {
            return 2;  // 不推荐
        }
    }
}
```

### 2. 异常处理建议
1. 只捕获需要的异常
2. 避免空的 catch 块
3. 使用 try-with-resources
4. 保持异常链
5. 记录异常信息
6. 清理资源

## 练习

1. 实现一个简单的文件读取器，包含异常处理
2. 编写一个重试机制，处理临时性故障
3. 实现一个异常转换器，将底层异常转换为业务异常

::: tip
建议多动手实践，通过实际项目来掌握异常处理。
:::

::: info 扩展阅读
- [Java 官方文档 - 异常处理](https://docs.oracle.com/javase/tutorial/essential/exceptions/)
- [Java 异常处理最佳实践](https://www.baeldung.com/java-exception-handling)
:::