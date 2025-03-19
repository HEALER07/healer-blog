---
title: Java 线程池与并发工具
icon: java
category:
  - Java 核心
tag:
  - Java
  - 线程池
  - 并发工具
date: 2024-03-19
---

# Java 线程池与并发工具

## 线程池概述

线程池是一种线程管理机制，它维护着多个线程，等待监督管理者分配可并发执行的任务。线程池的主要优势：

- 降低资源消耗
- 提高响应速度
- 提高线程的可管理性
- 提供更多功能

### 1. 线程池参数
```java
public class ThreadPoolParameters {
    // 核心线程数
    private int corePoolSize = 5;
    
    // 最大线程数
    private int maximumPoolSize = 10;
    
    // 空闲线程存活时间
    private long keepAliveTime = 60L;
    
    // 工作队列
    private BlockingQueue<Runnable> workQueue = new LinkedBlockingQueue<>(100);
    
    // 线程工厂
    private ThreadFactory threadFactory = Executors.defaultThreadFactory();
    
    // 拒绝策略
    private RejectedExecutionHandler handler = new ThreadPoolExecutor.AbortPolicy();
}
```

### 2. 线程池状态
```java
public class ThreadPoolStates {
    // 运行中
    private static final int RUNNING = -1 << 29;
    
    // 关闭中
    private static final int SHUTDOWN = 0 << 29;
    
    // 已停止
    private static final int STOP = 1 << 29;
    
    // 已终止
    private static final int TERMINATED = 2 << 29;
    
    // 已整理
    private static final int TIDYING = 3 << 29;
}
```

## 线程池类型

### 1. 固定大小线程池
```java
public class FixedThreadPool {
    private ExecutorService fixedPool = Executors.newFixedThreadPool(5);
    
    public void submitTask() {
        fixedPool.submit(() -> {
            System.out.println("任务执行");
        });
    }
    
    public void shutdown() {
        fixedPool.shutdown();
    }
}
```

### 2. 缓存线程池
```java
public class CachedThreadPool {
    private ExecutorService cachedPool = Executors.newCachedThreadPool();
    
    public void submitTask() {
        cachedPool.submit(() -> {
            System.out.println("任务执行");
        });
    }
    
    public void shutdown() {
        cachedPool.shutdown();
    }
}
```

### 3. 单线程池
```java
public class SingleThreadPool {
    private ExecutorService singlePool = Executors.newSingleThreadExecutor();
    
    public void submitTask() {
        singlePool.submit(() -> {
            System.out.println("任务执行");
        });
    }
    
    public void shutdown() {
        singlePool.shutdown();
    }
}
```

### 4. 定时任务线程池
```java
public class ScheduledThreadPool {
    private ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(3);
    
    public void scheduleTask() {
        // 延迟执行
        scheduledPool.schedule(() -> {
            System.out.println("延迟执行");
        }, 1, TimeUnit.SECONDS);
        
        // 定期执行
        scheduledPool.scheduleAtFixedRate(() -> {
            System.out.println("定期执行");
        }, 0, 1, TimeUnit.SECONDS);
    }
    
    public void shutdown() {
        scheduledPool.shutdown();
    }
}
```

## 自定义线程池

### 1. 基本实现
```java
public class CustomThreadPool {
    private ThreadPoolExecutor executor = new ThreadPoolExecutor(
        5,                      // 核心线程数
        10,                     // 最大线程数
        60L,                    // 空闲线程存活时间
        TimeUnit.SECONDS,       // 时间单位
        new LinkedBlockingQueue<>(100),  // 工作队列
        new ThreadFactory() {   // 线程工厂
            @Override
            public Thread newThread(Runnable r) {
                Thread thread = new Thread(r);
                thread.setName("CustomThread-" + thread.getId());
                return thread;
            }
        },
        new ThreadPoolExecutor.CallerRunsPolicy()  // 拒绝策略
    );
    
    public void submitTask(Runnable task) {
        executor.submit(task);
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}
```

### 2. 监控功能
```java
public class MonitoredThreadPool {
    private ThreadPoolExecutor executor = new ThreadPoolExecutor(
        5, 10, 60L, TimeUnit.SECONDS, new LinkedBlockingQueue<>(100)
    );
    
    public void monitor() {
        // 获取线程池状态
        int activeCount = executor.getActiveCount();
        int poolSize = executor.getPoolSize();
        int queueSize = executor.getQueue().size();
        long completedTaskCount = executor.getCompletedTaskCount();
        
        System.out.println("活跃线程数：" + activeCount);
        System.out.println("当前线程数：" + poolSize);
        System.out.println("队列任务数：" + queueSize);
        System.out.println("完成任务数：" + completedTaskCount);
    }
}
```

## 并发工具类

### 1. CountDownLatch
```java
public class CountDownLatchExample {
    private CountDownLatch latch = new CountDownLatch(3);
    
    public void worker() {
        // 工作线程
        new Thread(() -> {
            try {
                // 执行任务
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                latch.countDown();
            }
        }).start();
    }
    
    public void await() throws InterruptedException {
        // 等待所有工作线程完成
        latch.await();
        System.out.println("所有任务完成");
    }
}
```

### 2. CyclicBarrier
```java
public class CyclicBarrierExample {
    private CyclicBarrier barrier = new CyclicBarrier(3, () -> {
        System.out.println("所有线程到达屏障点");
    });
    
    public void worker() {
        new Thread(() -> {
            try {
                // 执行任务
                Thread.sleep(1000);
                barrier.await();
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

### 3. Semaphore
```java
public class SemaphoreExample {
    private Semaphore semaphore = new Semaphore(3);
    
    public void worker() {
        new Thread(() -> {
            try {
                semaphore.acquire();
                // 执行任务
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                semaphore.release();
            }
        }).start();
    }
}
```

## 线程池最佳实践

### 1. 线程池配置
```java
public class ThreadPoolConfig {
    // 计算密集型任务
    private ThreadPoolExecutor computePool = new ThreadPoolExecutor(
        Runtime.getRuntime().availableProcessors(),
        Runtime.getRuntime().availableProcessors() * 2,
        60L, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>(100)
    );
    
    // IO密集型任务
    private ThreadPoolExecutor ioPool = new ThreadPoolExecutor(
        Runtime.getRuntime().availableProcessors() * 2,
        Runtime.getRuntime().availableProcessors() * 4,
        60L, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>(100)
    );
}
```

### 2. 任务提交
```java
public class TaskSubmission {
    private ThreadPoolExecutor executor = new ThreadPoolExecutor(
        5, 10, 60L, TimeUnit.SECONDS, new LinkedBlockingQueue<>(100)
    );
    
    public void submitTask() {
        // 提交任务并获取Future
        Future<String> future = executor.submit(() -> {
            return "任务结果";
        });
        
        try {
            // 获取任务结果
            String result = future.get(5, TimeUnit.SECONDS);
            System.out.println("任务结果：" + result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 3. 优雅关闭
```java
public class GracefulShutdown {
    private ThreadPoolExecutor executor = new ThreadPoolExecutor(
        5, 10, 60L, TimeUnit.SECONDS, new LinkedBlockingQueue<>(100)
    );
    
    public void shutdown() {
        // 停止接收新任务
        executor.shutdown();
        
        try {
            // 等待任务完成
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                // 强制关闭
                executor.shutdownNow();
                // 等待线程响应中断
                if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                    System.err.println("线程池未正常关闭");
                }
            }
        } catch (InterruptedException e) {
            // 重新设置中断标志
            Thread.currentThread().interrupt();
        }
    }
}
```

## 常见问题

### 1. 线程池饱和
```java
public class ThreadPoolSaturation {
    private ThreadPoolExecutor executor = new ThreadPoolExecutor(
        5, 10, 60L, TimeUnit.SECONDS, new LinkedBlockingQueue<>(100)
    );
    
    public void handleSaturation() {
        // 1. 使用 CallerRunsPolicy
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        
        // 2. 使用自定义拒绝策略
        executor.setRejectedExecutionHandler((r, e) -> {
            // 记录日志
            System.err.println("任务被拒绝");
            // 保存到数据库
            saveToDatabase(r);
        });
    }
}
```

### 2. 任务异常处理
```java
public class TaskExceptionHandling {
    private ThreadPoolExecutor executor = new ThreadPoolExecutor(
        5, 10, 60L, TimeUnit.SECONDS, new LinkedBlockingQueue<>(100)
    );
    
    public void handleException() {
        executor.submit(() -> {
            try {
                // 执行任务
            } catch (Exception e) {
                // 处理异常
                System.err.println("任务执行异常：" + e.getMessage());
            }
        });
    }
}
```

## 练习

1. 实现一个简单的线程池，包含以下功能：
   - 核心线程数管理
   - 任务队列
   - 拒绝策略
   - 线程工厂

2. 使用线程池实现一个简单的任务调度系统：
   - 支持定时任务
   - 支持周期性任务
   - 支持任务取消

3. 实现一个基于线程池的并发下载器：
   - 支持多文件并发下载
   - 支持下载进度监控
   - 支持下载任务管理

::: tip
建议多动手实践，通过实际项目来掌握线程池和并发工具的使用。
:::

::: info 扩展阅读
- [Java 并发编程实战](https://jcip.net/)
- [Java 官方文档 - 并发编程](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
::: 