---
title: JVM 类加载机制
icon: java
category:
  - Java 核心
tag:
  - Java
  - JVM
  - 类加载
date: 2021-03-19
---

# JVM 类加载机制

## 类加载概述

类加载是 JVM 将类的字节码文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被 JVM 直接使用的 Java 类型的过程。

### 1. 类加载过程
```java
public class ClassLoadingProcess {
    // 1. 加载
    // 2. 验证
    // 3. 准备
    // 4. 解析
    // 5. 初始化
    // 6. 使用
    // 7. 卸载
}
```

### 2. 类加载时机
```java
public class ClassLoadingTiming {
    // 1. 创建类的实例
    private void createInstance() {
        MyClass obj = new MyClass();
    }
    
    // 2. 访问类的静态变量
    private void accessStaticField() {
        int value = MyClass.staticField;
    }
    
    // 3. 调用类的静态方法
    private void callStaticMethod() {
        MyClass.staticMethod();
    }
    
    // 4. 使用反射
    private void useReflection() throws ClassNotFoundException {
        Class<?> clazz = Class.forName("com.example.MyClass");
    }
}
```

## 类加载器

### 1. 类加载器层次
```java
public class ClassLoaderHierarchy {
    public void printClassLoader() {
        // 获取当前类的类加载器
        ClassLoader loader = this.getClass().getClassLoader();
        
        // 打印类加载器层次
        while (loader != null) {
            System.out.println(loader);
            loader = loader.getParent();
        }
        
        // 根类加载器
        System.out.println(loader);  // null
    }
}
```

### 2. 双亲委派模型
```java
public class ParentDelegation {
    public class CustomClassLoader extends ClassLoader {
        @Override
        protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
            synchronized (getClassLoadingLock(name)) {
                // 1. 检查类是否已加载
                Class<?> c = findLoadedClass(name);
                if (c == null) {
                    try {
                        // 2. 委派给父类加载器
                        if (getParent() != null) {
                            c = getParent().loadClass(name);
                        } else {
                            // 3. 使用根类加载器
                            c = findBootstrapClassOrNull(name);
                        }
                    } catch (ClassNotFoundException e) {
                        // 4. 父类加载器无法加载，自己尝试加载
                        c = findClass(name);
                    }
                }
                if (resolve) {
                    resolveClass(c);
                }
                return c;
            }
        }
    }
}
```

### 3. 自定义类加载器
```java
public class CustomClassLoader extends ClassLoader {
    private String classPath;
    
    public CustomClassLoader(String classPath) {
        this.classPath = classPath;
    }
    
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        try {
            // 读取类文件
            byte[] data = loadClassData(name);
            // 定义类
            return defineClass(name, data, 0, data.length);
        } catch (Exception e) {
            throw new ClassNotFoundException(name);
        }
    }
    
    private byte[] loadClassData(String name) throws IOException {
        name = name.replace('.', '/');
        FileInputStream fis = new FileInputStream(classPath + "/" + name + ".class");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int b = 0;
        while ((b = fis.read()) != -1) {
            baos.write(b);
        }
        return baos.toByteArray();
    }
}
```

## 类加载过程详解

### 1. 加载阶段
```java
public class LoadingPhase {
    public class ClassLoaderExample {
        // 1. 通过类的全限定名获取类的二进制字节流
        private byte[] getClassBytes(String className) {
            // 从文件系统读取
            // 从网络获取
            // 从数据库读取
            // 从压缩包读取
            return null;
        }
        
        // 2. 将字节流转换为方法区的运行时数据结构
        private void convertToRuntimeData(byte[] bytes) {
            // 转换为运行时数据结构
        }
        
        // 3. 在内存中生成一个代表这个类的 Class 对象
        private Class<?> generateClassObject() {
            return null;
        }
    }
}
```

### 2. 验证阶段
```java
public class VerificationPhase {
    public class Verifier {
        // 1. 文件格式验证
        private void verifyFileFormat(byte[] bytes) {
            // 验证魔数
            // 验证版本号
            // 验证常量池
        }
        
        // 2. 元数据验证
        private void verifyMetadata(Class<?> clazz) {
            // 验证类的继承关系
            // 验证字段和方法
            // 验证抽象方法实现
        }
        
        // 3. 字节码验证
        private void verifyBytecode(byte[] bytes) {
            // 验证操作数栈
            // 验证局部变量表
            // 验证跳转指令
        }
        
        // 4. 符号引用验证
        private void verifySymbolicReference(Class<?> clazz) {
            // 验证符号引用
            // 验证类是否存在
            // 验证访问权限
        }
    }
}
```

### 3. 准备阶段
```java
public class PreparationPhase {
    public class Preparator {
        // 1. 为类变量分配内存
        private static int staticVar;  // 初始值为 0
        
        // 2. 设置类变量初始值
        private static final int CONSTANT = 123;  // 直接赋值
        
        // 3. 为实例变量分配内存
        private int instanceVar;  // 初始值为 0
    }
}
```

### 4. 解析阶段
```java
public class ResolutionPhase {
    public class Resolver {
        // 1. 类或接口的解析
        private void resolveClassOrInterface(String className) {
            // 解析类或接口
        }
        
        // 2. 字段解析
        private void resolveField(String fieldName) {
            // 解析字段
        }
        
        // 3. 方法解析
        private void resolveMethod(String methodName) {
            // 解析方法
        }
        
        // 4. 接口方法解析
        private void resolveInterfaceMethod(String methodName) {
            // 解析接口方法
        }
    }
}
```

### 5. 初始化阶段
```java
public class InitializationPhase {
    public class Initializer {
        // 1. 执行类构造器 <clinit>()
        static {
            // 按顺序执行类变量的赋值操作
            // 执行静态初始化块
        }
        
        // 2. 执行实例构造器 <init>()
        {
            // 按顺序执行实例变量的赋值操作
            // 执行实例初始化块
        }
    }
}
```

## 类加载器应用

### 1. 热部署
```java
public class HotDeployment {
    public class HotDeployClassLoader extends ClassLoader {
        private String classPath;
        
        public HotDeployClassLoader(String classPath) {
            this.classPath = classPath;
        }
        
        @Override
        protected Class<?> findClass(String name) throws ClassNotFoundException {
            try {
                byte[] data = loadClassData(name);
                return defineClass(name, data, 0, data.length);
            } catch (Exception e) {
                throw new ClassNotFoundException(name);
            }
        }
        
        private byte[] loadClassData(String name) throws IOException {
            // 从文件系统加载类文件
            return null;
        }
    }
}
```

### 2. 加密类加载
```java
public class EncryptedClassLoader extends ClassLoader {
    private String classPath;
    
    public EncryptedClassLoader(String classPath) {
        this.classPath = classPath;
    }
    
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        try {
            // 1. 读取加密的类文件
            byte[] encryptedData = loadEncryptedClassData(name);
            // 2. 解密数据
            byte[] decryptedData = decrypt(encryptedData);
            // 3. 定义类
            return defineClass(name, decryptedData, 0, decryptedData.length);
        } catch (Exception e) {
            throw new ClassNotFoundException(name);
        }
    }
    
    private byte[] decrypt(byte[] encryptedData) {
        // 实现解密逻辑
        return null;
    }
}
```

### 3. 网络类加载
```java
public class NetworkClassLoader extends ClassLoader {
    private String baseUrl;
    
    public NetworkClassLoader(String baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        try {
            // 1. 从网络加载类文件
            byte[] data = loadClassFromNetwork(name);
            // 2. 定义类
            return defineClass(name, data, 0, data.length);
        } catch (Exception e) {
            throw new ClassNotFoundException(name);
        }
    }
    
    private byte[] loadClassFromNetwork(String name) throws IOException {
        // 实现网络加载逻辑
        return null;
    }
}
```

## 常见问题

### 1. 类加载失败
```java
public class ClassLoadingFailure {
    public void testClassLoadingFailure() {
        try {
            // 1. 类文件不存在
            Class.forName("NonExistentClass");
            
            // 2. 类文件损坏
            Class.forName("CorruptedClass");
            
            // 3. 类加载器无法访问类文件
            Class.forName("InaccessibleClass");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

### 2. 类加载冲突
```java
public class ClassLoadingConflict {
    public void testClassLoadingConflict() {
        // 1. 不同类加载器加载同一个类
        ClassLoader loader1 = new CustomClassLoader("path1");
        ClassLoader loader2 = new CustomClassLoader("path2");
        
        try {
            Class<?> clazz1 = loader1.loadClass("MyClass");
            Class<?> clazz2 = loader2.loadClass("MyClass");
            
            // 两个类对象不相等
            System.out.println(clazz1 == clazz2);  // false
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

### 3. 类加载死锁
```java
public class ClassLoadingDeadlock {
    static class A {
        static {
            try {
                Thread.sleep(1000);
                Class.forName("B");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    static class B {
        static {
            try {
                Thread.sleep(1000);
                Class.forName("A");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
```

## 练习

1. 实现一个简单的类加载器：
   - 支持从文件系统加载类
   - 支持从网络加载类
   - 支持热部署

2. 编写一个类加载器示例：
   - 实现双亲委派模型
   - 实现自定义类加载器
   - 实现类加载监控

3. 实现一个加密类加载器：
   - 支持类文件加密
   - 支持运行时解密
   - 支持类加载验证

::: tip
建议多动手实践，通过实际项目来掌握类加载机制。
:::

::: info 扩展阅读
- [JVM 规范](https://docs.oracle.com/javase/specs/jvms/se8/html/)
- [深入理解 Java 虚拟机](https://book.douban.com/subject/34907497/)
:::