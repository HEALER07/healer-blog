---
title: JVM 内存模型与垃圾回收
icon: java
category:
  - Java 核心
tag:
  - Java
  - JVM
  - 内存模型
  - 垃圾回收
date: 2021-03-19
---

# JVM 内存模型与垃圾回收

## JVM 内存模型概述

JVM 内存模型定义了 Java 程序在运行时的内存结构，包括程序计数器、虚拟机栈、本地方法栈、堆和方法区。

### 1. 内存区域划分
```java
public class MemoryAreas {
    // 1. 程序计数器
    // 当前线程执行的字节码行号指示器
    
    // 2. 虚拟机栈
    private void stackExample() {
        int localVar = 1;  // 局部变量
        Object obj = new Object();  // 对象引用
    }
    
    // 3. 本地方法栈
    // 执行本地方法
    
    // 4. 堆
    private Object heapObj = new Object();  // 对象实例
    
    // 5. 方法区
    // 存储类信息、常量、静态变量等
}
```

### 2. 内存分配
```java
public class MemoryAllocation {
    // 1. 对象优先在 Eden 区分配
    private void edenAllocation() {
        byte[] allocation1 = new byte[2 * 1024 * 1024];  // 2MB
        byte[] allocation2 = new byte[2 * 1024 * 1024];  // 2MB
        byte[] allocation3 = new byte[2 * 1024 * 1024];  // 2MB
        byte[] allocation4 = new byte[4 * 1024 * 1024];  // 4MB
    }
    
    // 2. 大对象直接进入老年代
    private void largeObjectAllocation() {
        byte[] largeObject = new byte[8 * 1024 * 1024];  // 8MB
    }
}
```

## 垃圾回收概述

垃圾回收是 JVM 自动管理内存的机制，主要解决内存分配和回收问题。

### 1. 垃圾回收算法
```java
public class GarbageCollection {
    // 1. 标记-清除算法
    private void markSweep() {
        // 标记所有可达对象
        // 清除未标记对象
    }
    
    // 2. 复制算法
    private void copy() {
        // 将存活对象复制到另一个空间
        // 清空当前空间
    }
    
    // 3. 标记-整理算法
    private void markCompact() {
        // 标记所有可达对象
        // 将存活对象向一端移动
        // 清理边界外的内存
    }
}
```

### 2. 垃圾收集器
```java
public class GarbageCollectors {
    // 1. Serial 收集器
    // -XX:+UseSerialGC
    
    // 2. Parallel 收集器
    // -XX:+UseParallelGC
    
    // 3. CMS 收集器
    // -XX:+UseConcMarkSweepGC
    
    // 4. G1 收集器
    // -XX:+UseG1GC
}
```

## 内存分配策略

### 1. 对象优先在 Eden 区分配
```java
public class EdenAllocation {
    private static final int _1MB = 1024 * 1024;
    
    public static void testAllocation() {
        byte[] allocation1 = new byte[2 * _1MB];
        byte[] allocation2 = new byte[2 * _1MB];
        byte[] allocation3 = new byte[2 * _1MB];
        byte[] allocation4 = new byte[4 * _1MB];  // 出现 Minor GC
    }
}
```

### 2. 大对象直接进入老年代
```java
public class LargeObjectAllocation {
    private static final int _1MB = 1024 * 1024;
    
    public static void testPretenureSizeThreshold() {
        byte[] allocation = new byte[4 * _1MB];  // 直接分配在老年代
    }
}
```

### 3. 长期存活的对象进入老年代
```java
public class LongLivedObject {
    private static final int _1MB = 1024 * 1024;
    
    public static void testTenuringThreshold() {
        byte[] allocation1 = new byte[_1MB / 4];
        byte[] allocation2 = new byte[4 * _1MB];
        byte[] allocation3 = new byte[4 * _1MB];
        allocation3 = null;
        byte[] allocation4 = new byte[4 * _1MB];
    }
}
```

## 垃圾回收机制

### 1. 引用计数算法
```java
public class ReferenceCounting {
    private Object instance = null;
    
    public void testGC() {
        ReferenceCounting objA = new ReferenceCounting();
        ReferenceCounting objB = new ReferenceCounting();
        
        objA.instance = objB;
        objB.instance = objA;
        
        objA = null;
        objB = null;
        
        System.gc();
    }
}
```

### 2. 可达性分析算法
```java
public class ReachabilityAnalysis {
    public static ReferenceCounting root = null;
    
    public void testGC() {
        ReferenceCounting objA = new ReferenceCounting();
        ReferenceCounting objB = new ReferenceCounting();
        
        objA.instance = objB;
        objB.instance = objA;
        
        root = objA;
        objA = null;
        objB = null;
        
        System.gc();
    }
}
```

### 3. 引用类型
```java
public class ReferenceTypes {
    // 1. 强引用
    private Object strongRef = new Object();
    
    // 2. 软引用
    private SoftReference<Object> softRef = new SoftReference<>(new Object());
    
    // 3. 弱引用
    private WeakReference<Object> weakRef = new WeakReference<>(new Object());
    
    // 4. 虚引用
    private PhantomReference<Object> phantomRef = new PhantomReference<>(new Object(), new ReferenceQueue<>());
}
```

## 垃圾收集器详解

### 1. Serial 收集器
```java
public class SerialCollector {
    // 单线程收集器
    // -XX:+UseSerialGC
    // -XX:+PrintGCDetails
    // -Xms20M
    // -Xmx20M
    // -Xmn10M
    // -XX:SurvivorRatio=8
}
```

### 2. Parallel 收集器
```java
public class ParallelCollector {
    // 多线程收集器
    // -XX:+UseParallelGC
    // -XX:ParallelGCThreads=4
    // -XX:MaxGCPauseMillis=100
    // -XX:GCTimeRatio=99
}
```

### 3. CMS 收集器
```java
public class CMSCollector {
    // 并发标记清除收集器
    // -XX:+UseConcMarkSweepGC
    // -XX:CMSInitiatingOccupancyFraction=68
    // -XX:+UseCMSCompactAtFullCollection
    // -XX:CMSFullGCsBeforeCompaction=1
}
```

### 4. G1 收集器
```java
public class G1Collector {
    // 分区收集器
    // -XX:+UseG1GC
    // -XX:MaxGCPauseMillis=200
    // -XX:G1HeapRegionSize=16m
    // -XX:G1ReservePercent=5
}
```

## 内存分配与回收策略

### 1. 对象优先在 Eden 区分配
```java
public class EdenAllocationStrategy {
    private static final int _1MB = 1024 * 1024;
    
    public static void testAllocation() {
        byte[] allocation1 = new byte[2 * _1MB];
        byte[] allocation2 = new byte[2 * _1MB];
        byte[] allocation3 = new byte[2 * _1MB];
        byte[] allocation4 = new byte[4 * _1MB];  // 出现 Minor GC
    }
}
```

### 2. 大对象直接进入老年代
```java
public class LargeObjectStrategy {
    private static final int _1MB = 1024 * 1024;
    
    public static void testPretenureSizeThreshold() {
        byte[] allocation = new byte[4 * _1MB];  // 直接分配在老年代
    }
}
```

### 3. 长期存活的对象进入老年代
```java
public class LongLivedObjectStrategy {
    private static final int _1MB = 1024 * 1024;
    
    public static void testTenuringThreshold() {
        byte[] allocation1 = new byte[_1MB / 4];
        byte[] allocation2 = new byte[4 * _1MB];
        byte[] allocation3 = new byte[4 * _1MB];
        allocation3 = null;
        byte[] allocation4 = new byte[4 * _1MB];
    }
}
```

## 内存监控与调优

### 1. JVM 参数配置
```java
public class JVMConfig {
    // 堆内存配置
    // -Xms20M -Xmx20M -Xmn10M
    
    // GC 配置
    // -XX:+UseG1GC
    // -XX:MaxGCPauseMillis=200
    
    // 内存溢出配置
    // -XX:+HeapDumpOnOutOfMemoryError
    // -XX:HeapDumpPath=/path/to/dump
}
```

### 2. 内存监控
```java
public class MemoryMonitor {
    public void monitor() {
        // 获取堆内存信息
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        System.out.println("最大内存：" + maxMemory / 1024 / 1024 + "MB");
        System.out.println("总内存：" + totalMemory / 1024 / 1024 + "MB");
        System.out.println("空闲内存：" + freeMemory / 1024 / 1024 + "MB");
        System.out.println("已用内存：" + usedMemory / 1024 / 1024 + "MB");
    }
}
```

### 3. GC 日志分析
```java
public class GCLogAnalysis {
    // -XX:+PrintGCDetails
    // -XX:+PrintGCDateStamps
    // -Xloggc:/path/to/gc.log
    
    public void generateGC() {
        List<byte[]> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            list.add(new byte[1024 * 1024]);
        }
    }
}
```

## 常见问题

### 1. 内存溢出
```java
public class OutOfMemory {
    public void testOOM() {
        List<byte[]> list = new ArrayList<>();
        while (true) {
            list.add(new byte[1024 * 1024]);  // 1MB
        }
    }
}
```

### 2. 内存泄漏
```java
public class MemoryLeak {
    private static List<Object> list = new ArrayList<>();
    
    public void addObject() {
        list.add(new Object());  // 对象一直被引用，无法回收
    }
}
```

### 3. GC 停顿
```java
public class GCPause {
    public void testGCPause() {
        List<byte[]> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            list.add(new byte[1024 * 1024]);  // 触发 GC
        }
    }
}
```

## 练习

1. 实现一个简单的内存监控工具：
   - 监控堆内存使用情况
   - 监控 GC 情况
   - 生成内存报告

2. 编写一个内存泄漏示例：
   - 使用静态集合
   - 使用缓存
   - 使用监听器

3. 实现一个 GC 调优示例：
   - 配置不同的 GC 参数
   - 分析 GC 日志
   - 优化内存分配

::: tip
建议多动手实践，通过实际项目来掌握 JVM 内存管理和垃圾回收机制。
:::

::: info 扩展阅读
- [JVM 规范](https://docs.oracle.com/javase/specs/jvms/se8/html/)
- [Java 性能优化权威指南](https://www.oreilly.com/library/view/java-performance-the/9781449363512/)
:::