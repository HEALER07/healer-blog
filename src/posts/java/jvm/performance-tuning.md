---
title: JVM 性能调优
icon: java
category:
  - Java 核心
tag:
  - Java
  - JVM
  - 性能调优
date: 2024-03-19
---

# JVM 性能调优

## JVM 参数配置

### 1. 内存配置
```bash
# 堆内存配置
-Xms2g                 # 初始堆大小
-Xmx2g                 # 最大堆大小
-XX:NewSize=1g         # 初始新生代大小
-XX:MaxNewSize=1g      # 最大新生代大小
-XX:SurvivorRatio=8    # Eden区与Survivor区的比例
-XX:NewRatio=2         # 新生代与老年代的比例

# 元空间配置
-XX:MetaspaceSize=256m    # 初始元空间大小
-XX:MaxMetaspaceSize=512m # 最大元空间大小

# 直接内存配置
-XX:MaxDirectMemorySize=1g # 最大直接内存大小
```

### 2. GC 配置
```bash
# GC 收集器选择
-XX:+UseSerialGC           # 使用串行收集器
-XX:+UseParallelGC         # 使用并行收集器
-XX:+UseConcMarkSweepGC    # 使用 CMS 收集器
-XX:+UseG1GC               # 使用 G1 收集器

# GC 参数配置
-XX:MaxGCPauseMillis=200   # 最大 GC 停顿时间
-XX:GCTimeRatio=99         # GC 时间比例
-XX:+UseAdaptiveSizePolicy # 使用自适应大小策略
-XX:InitialRAMPercentage=70.0  # 初始堆内存百分比
-XX:MaxRAMPercentage=70.0      # 最大堆内存百分比
```

### 3. 线程配置
```bash
# 线程栈配置
-Xss1m                 # 线程栈大小

# 线程池配置
-XX:ThreadStackSize=1024  # 线程栈大小
```

## 性能监控

### 1. JVM 监控工具
```java
public class JVMMonitoring {
    // 1. JConsole
    public void useJConsole() {
        // 启动 JConsole
        // jconsole <pid>
    }
    
    // 2. VisualVM
    public void useVisualVM() {
        // 启动 VisualVM
        // jvisualvm
    }
    
    // 3. JProfiler
    public void useJProfiler() {
        // 使用 JProfiler 进行性能分析
    }
}
```

### 2. 命令行工具
```bash
# 1. jps - 查看 Java 进程
jps -l

# 2. jstat - 查看 JVM 统计信息
jstat -gc <pid> 1000 10  # 每秒采样一次，共10次

# 3. jmap - 查看内存映射
jmap -heap <pid>

# 4. jstack - 查看线程栈
jstack <pid>

# 5. jinfo - 查看和修改 JVM 参数
jinfo -flags <pid>
```

### 3. 性能指标监控
```java
public class PerformanceMetrics {
    // 1. GC 监控
    public void monitorGC() {
        // 获取 GC 信息
        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
        for (GarbageCollectorMXBean gcBean : gcBeans) {
            System.out.println("GC Name: " + gcBean.getName());
            System.out.println("Collection Count: " + gcBean.getCollectionCount());
            System.out.println("Collection Time: " + gcBean.getCollectionTime());
        }
    }
    
    // 2. 内存监控
    public void monitorMemory() {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        System.out.println("Max Memory: " + maxMemory);
        System.out.println("Total Memory: " + totalMemory);
        System.out.println("Free Memory: " + freeMemory);
        System.out.println("Used Memory: " + usedMemory);
    }
    
    // 3. 线程监控
    public void monitorThreads() {
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        long[] threadIds = threadBean.getAllThreadIds();
        ThreadInfo[] threadInfos = threadBean.getThreadInfo(threadIds);
        
        for (ThreadInfo threadInfo : threadInfos) {
            System.out.println("Thread Name: " + threadInfo.getThreadName());
            System.out.println("Thread State: " + threadInfo.getThreadState());
            System.out.println("Blocked Time: " + threadInfo.getBlockedTime());
            System.out.println("Blocked Count: " + threadInfo.getBlockedCount());
        }
    }
}
```

## 性能优化

### 1. 内存优化
```java
public class MemoryOptimization {
    // 1. 对象复用
    public void reuseObjects() {
        // 使用对象池
        ObjectPool pool = new ObjectPool();
        Object obj = pool.borrowObject();
        try {
            // 使用对象
        } finally {
            pool.returnObject(obj);
        }
    }
    
    // 2. 避免内存泄漏
    public void avoidMemoryLeak() {
        // 及时释放资源
        try (FileInputStream fis = new FileInputStream("file.txt")) {
            // 使用资源
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    // 3. 使用软引用和弱引用
    public void useReferences() {
        // 软引用
        SoftReference<Object> softRef = new SoftReference<>(new Object());
        
        // 弱引用
        WeakReference<Object> weakRef = new WeakReference<>(new Object());
        
        // 虚引用
        PhantomReference<Object> phantomRef = new PhantomReference<>(new Object(), new ReferenceQueue<>());
    }
}
```

### 2. GC 优化
```java
public class GCOptimization {
    // 1. 选择合适的 GC 收集器
    public void chooseGC() {
        // 根据应用特点选择 GC
        // 1. 串行收集器：单 CPU、小内存
        // 2. 并行收集器：多 CPU、大内存
        // 3. CMS 收集器：低延迟
        // 4. G1 收集器：大内存、低延迟
    }
    
    // 2. 调整 GC 参数
    public void tuneGC() {
        // 1. 调整新生代大小
        // 2. 调整 Survivor 区比例
        // 3. 调整晋升阈值
        // 4. 调整 GC 触发条件
    }
    
    // 3. 减少 GC 频率
    public void reduceGCFrequency() {
        // 1. 避免创建过多临时对象
        // 2. 使用 StringBuilder 替代 String 拼接
        // 3. 使用基本类型替代包装类型
        // 4. 及时释放不再使用的对象
    }
}
```

### 3. 线程优化
```java
public class ThreadOptimization {
    // 1. 使用线程池
    public void useThreadPool() {
        ExecutorService executor = Executors.newFixedThreadPool(10);
        try {
            // 提交任务
            Future<?> future = executor.submit(() -> {
                // 执行任务
            });
            // 获取结果
            future.get();
        } finally {
            executor.shutdown();
        }
    }
    
    // 2. 避免线程死锁
    public void avoidDeadlock() {
        // 1. 固定加锁顺序
        // 2. 使用超时机制
        // 3. 使用 tryLock
        Lock lock1 = new ReentrantLock();
        Lock lock2 = new ReentrantLock();
        
        if (lock1.tryLock(1, TimeUnit.SECONDS)) {
            try {
                if (lock2.tryLock(1, TimeUnit.SECONDS)) {
                    try {
                        // 执行操作
                    } finally {
                        lock2.unlock();
                    }
                }
            } finally {
                lock1.unlock();
            }
        }
    }
    
    // 3. 使用并发集合
    public void useConcurrentCollections() {
        // 1. ConcurrentHashMap
        Map<String, String> map = new ConcurrentHashMap<>();
        
        // 2. CopyOnWriteArrayList
        List<String> list = new CopyOnWriteArrayList<>();
        
        // 3. BlockingQueue
        Queue<String> queue = new LinkedBlockingQueue<>();
    }
}
```

## 性能调优实践

### 1. 系统调优
```java
public class SystemTuning {
    // 1. 操作系统调优
    public void tuneOS() {
        // 1. 调整文件描述符限制
        // 2. 调整最大进程数
        // 3. 调整 TCP 参数
        // 4. 调整内存参数
    }
    
    // 2. JVM 调优
    public void tuneJVM() {
        // 1. 调整堆内存大小
        // 2. 调整 GC 参数
        // 3. 调整线程参数
        // 4. 调整编译参数
    }
    
    // 3. 应用调优
    public void tuneApplication() {
        // 1. 优化代码逻辑
        // 2. 优化数据结构
        // 3. 优化算法
        // 4. 优化配置
    }
}
```

### 2. 性能测试
```java
public class PerformanceTesting {
    // 1. 压力测试
    public void stressTest() {
        // 使用 JMeter 进行压力测试
        // 1. 设置并发用户数
        // 2. 设置持续时间
        // 3. 设置测试场景
        // 4. 收集测试结果
    }
    
    // 2. 性能分析
    public void performanceAnalysis() {
        // 使用性能分析工具
        // 1. 分析 CPU 使用率
        // 2. 分析内存使用情况
        // 3. 分析 GC 情况
        // 4. 分析线程情况
    }
    
    // 3. 性能优化
    public void optimizePerformance() {
        // 根据分析结果进行优化
        // 1. 优化代码
        // 2. 优化配置
        // 3. 优化架构
        // 4. 验证优化效果
    }
}
```

## 常见问题

### 1. 内存溢出
```java
public class MemoryOverflow {
    // 1. 堆内存溢出
    public void heapOverflow() {
        List<Object> list = new ArrayList<>();
        while (true) {
            list.add(new Object());
        }
    }
    
    // 2. 栈内存溢出
    public void stackOverflow() {
        stackOverflow();  // 递归调用
    }
    
    // 3. 方法区溢出
    public void methodAreaOverflow() {
        // 动态生成类
        while (true) {
            generateClass();
        }
    }
}
```

### 2. GC 问题
```java
public class GCProblems {
    // 1. GC 停顿时间过长
    public void longGCPause() {
        // 1. 调整 GC 参数
        // 2. 使用 G1 收集器
        // 3. 减少对象创建
        // 4. 优化对象生命周期
    }
    
    // 2. GC 频率过高
    public void highGCFrequency() {
        // 1. 增加堆内存
        // 2. 调整新生代大小
        // 3. 优化对象创建
        // 4. 使用对象池
    }
    
    // 3. 内存泄漏
    public void memoryLeak() {
        // 1. 使用内存分析工具
        // 2. 检查资源释放
        // 3. 检查集合类使用
        // 4. 检查缓存使用
    }
}
```

## 练习

1. 性能监控实践：
   - 使用 JConsole 监控 JVM
   - 使用 VisualVM 分析性能
   - 使用 JProfiler 定位问题

2. 性能优化实践：
   - 优化内存使用
   - 优化 GC 性能
   - 优化线程性能

3. 性能测试实践：
   - 编写性能测试用例
   - 进行压力测试
   - 分析测试结果

::: tip
性能调优是一个持续的过程，需要不断监控、分析和优化。
:::

::: info 扩展阅读
- [Java Performance](https://www.oreilly.com/library/view/java-performance-2nd/9781449358452/)
- [Java Performance Tuning Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/)
::: 