---
title: Java 反射与注解
icon: java
category:
  - Java 核心
tag:
  - Java
  - 反射
  - 注解
date: 2021-03-19
---

# Java 反射与注解

## 反射概述

反射（Reflection）是 Java 提供的一种机制，允许程序在运行时获取类的信息并操作类的属性和方法。

### 1. 获取 Class 对象
```java
// 方式1：通过类名
Class<?> clazz = String.class;

// 方式2：通过对象
String str = "Hello";
Class<?> clazz = str.getClass();

// 方式3：通过类名字符串
Class<?> clazz = Class.forName("java.lang.String");
```

### 2. 获取构造方法
```java
// 获取所有公共构造方法
Constructor<?>[] constructors = clazz.getConstructors();

// 获取所有构造方法（包括私有）
Constructor<?>[] allConstructors = clazz.getDeclaredConstructors();

// 获取指定参数的构造方法
Constructor<?> constructor = clazz.getConstructor(String.class);

// 创建对象
Object obj = constructor.newInstance("Hello");
```

### 3. 获取字段
```java
// 获取所有公共字段
Field[] fields = clazz.getFields();

// 获取所有字段（包括私有）
Field[] allFields = clazz.getDeclaredFields();

// 获取指定字段
Field field = clazz.getField("name");

// 获取字段值
Object value = field.get(obj);

// 设置字段值
field.set(obj, "New Value");
```

### 4. 获取方法
```java
// 获取所有公共方法
Method[] methods = clazz.getMethods();

// 获取所有方法（包括私有）
Method[] allMethods = clazz.getDeclaredMethods();

// 获取指定方法
Method method = clazz.getMethod("getName");

// 调用方法
Object result = method.invoke(obj);
```

## 注解概述

注解（Annotation）是一种元数据，用于为代码提供额外的信息。

### 1. 内置注解
```java
// @Override - 表示方法重写
@Override
public String toString() {
    return "Custom toString";
}

// @Deprecated - 表示方法已过时
@Deprecated
public void oldMethod() {
    // 过时的方法
}

// @SuppressWarnings - 抑制警告
@SuppressWarnings("unused")
public void unusedMethod() {
    // 未使用的方法
}
```

### 2. 自定义注解
```java
// 定义注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
    String value() default "";
    int count() default 0;
}

// 使用注解
@MyAnnotation(value = "test", count = 5)
public void testMethod() {
    // 方法实现
}
```

### 3. 注解属性
```java
// 定义注解
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Table {
    String name();
    String[] columns() default {};
}

// 使用注解
@Table(name = "users", columns = {"id", "name", "age"})
public class User {
    // 类实现
}
```

## 反射与注解的应用

### 1. 对象序列化
```java
public class Serializer {
    public static String serialize(Object obj) {
        StringBuilder sb = new StringBuilder();
        Class<?> clazz = obj.getClass();
        
        // 获取所有字段
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            try {
                sb.append(field.getName())
                  .append(":")
                  .append(field.get(obj))
                  .append(",");
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }
}
```

### 2. 依赖注入
```java
// 定义注解
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Inject {
}

// 使用注解
public class UserService {
    @Inject
    private UserDao userDao;
}

// 实现依赖注入
public class Container {
    public static void inject(Object obj) {
        Class<?> clazz = obj.getClass();
        Field[] fields = clazz.getDeclaredFields();
        
        for (Field field : fields) {
            if (field.isAnnotationPresent(Inject.class)) {
                field.setAccessible(true);
                try {
                    Object value = createInstance(field.getType());
                    field.set(obj, value);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

### 3. 单元测试框架
```java
// 定义测试注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Test {
    String expected() default "";
}

// 使用注解
public class CalculatorTest {
    @Test(expected = "4")
    public void testAdd() {
        Calculator calc = new Calculator();
        assertEquals(4, calc.add(2, 2));
    }
}

// 运行测试
public class TestRunner {
    public static void runTests(Class<?> testClass) {
        Object testInstance = testClass.newInstance();
        Method[] methods = testClass.getDeclaredMethods();
        
        for (Method method : methods) {
            if (method.isAnnotationPresent(Test.class)) {
                method.invoke(testInstance);
            }
        }
    }
}
```

## 性能考虑

### 1. 反射性能优化
```java
// 缓存 Class 对象
private static final Class<?> clazz = String.class;

// 缓存构造方法
private static final Constructor<?> constructor = clazz.getConstructor(String.class);

// 缓存字段
private static final Field field = clazz.getDeclaredField("value");
field.setAccessible(true);

// 缓存方法
private static final Method method = clazz.getMethod("length");
```

### 2. 注解处理器
```java
// 定义注解处理器
@SupportedAnnotationTypes("com.example.MyAnnotation")
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class MyAnnotationProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations,
                          RoundEnvironment roundEnv) {
        // 处理注解
        return true;
    }
}
```

## 最佳实践

1. **合理使用反射**
   - 优先使用普通方法调用
   - 只在必要时使用反射
   - 缓存反射获取的对象

2. **注解使用规范**
   - 注解命名要清晰
   - 注解属性要有默认值
   - 注解要有明确的用途

3. **安全性考虑**
   - 反射可能破坏封装性
   - 注意访问权限控制
   - 防止反射攻击

## 常见问题

1. **反射性能问题**
   - 反射调用比普通调用慢
   - 需要缓存反射对象
   - 避免频繁使用反射

2. **注解使用问题**
   - 注解属性类型有限
   - 注解不能继承
   - 注解不能包含方法

3. **安全性问题**
   - 反射可以访问私有成员
   - 反射可以修改 final 字段
   - 反射可以调用私有方法

## 练习

1. 实现一个简单的对象序列化工具
2. 编写一个简单的依赖注入容器
3. 实现一个简单的单元测试框架

::: tip
建议多动手实践，通过实际项目来掌握反射和注解的使用。
:::

::: info 扩展阅读
- [Java 官方文档 - 反射](https://docs.oracle.com/javase/tutorial/reflect/)
- [Java 注解教程](https://www.baeldung.com/java-annotations)
:::