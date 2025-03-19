---
title: Java 线程基础
icon: java
category:
  - Java 核心
tag:
  - Java
  - 线程
  - 并发
date: 2024-03-19
---

# Java 线程基础

## 线程概述

线程（Thread）是程序执行的最小单位，一个进程可以包含多个线程。Java 中的线程特点：

- 轻量级
- 共享进程资源
- 独立执行
- 并发执行

### 1. 线程状态
```java
public enum Thread.State {
    NEW,           // 新建
    RUNNABLE,      // 可运行
    BLOCKED,       // 阻塞
    WAITING,       // 等待
    TIMED_WAITING, // 超时等待
    TERMINATED     // 终止
}
```

### 2. 线程优先级
```java
public class ThreadPriority {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            System.out.println("线程优先级：" + Thread.currentThread().getPriority());
        });
        
        // 设置优先级（1-10）
        thread.setPriority(Thread.MAX_PRIORITY);  // 10
        thread.setPriority(Thread.NORM_PRIORITY); // 5
        thread.setPriority(Thread.MIN_PRIORITY);  // 1
        
        thread.start();
    }
}
```

## 创建线程

### 1. 继承 Thread 类
```java
public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("线程执行：" + Thread.currentThread().getName());
    }
    
    public static void main(String[] args) {
        MyThread thread = new MyThread();
        thread.start();  // 启动线程
    }
}
```

### 2. 实现 Runnable 接口
```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("线程执行：" + Thread.currentThread().getName());
    }
    
    public static void main(String[] args) {
        MyRunnable runnable = new MyRunnable();
        Thread thread = new Thread(runnable);
        thread.start();
    }
}
```

### 3. 使用 Lambda 表达式
```java
public class LambdaThread {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            System.out.println("线程执行：" + Thread.currentThread().getName());
        });
        thread.start();
    }
}
```

## 线程控制

### 1. 启动线程
```java
public class ThreadControl {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            System.out.println("线程执行");
        });
        
        // 启动线程
        thread.start();
        
        // 等待线程结束
        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

### 2. 线程休眠
```java
public class ThreadSleep {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            try {
                // 休眠 1 秒
                Thread.sleep(1000);
                System.out.println("线程执行");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        thread.start();
    }
}
```

### 3. 线程中断
```java
public class ThreadInterrupt {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    Thread.sleep(1000);
                    System.out.println("线程执行");
                } catch (InterruptedException e) {
                    // 处理中断
                    Thread.currentThread().interrupt();
                }
            }
        });
        
        thread.start();
        
        // 中断线程
        thread.interrupt();
    }
}
```

## 线程同步

### 1. synchronized 关键字
```java
public class SynchronizedExample {
    private int count = 0;
    
    // 同步方法
    public synchronized void increment() {
        count++;
        System.out.println("Count: " + count);
    }
    
    // 同步代码块
    public void decrement() {
        synchronized (this) {
            count--;
            System.out.println("Count: " + count);
        }
    }
}
```

### 2. volatile 关键字
```java
public class VolatileExample {
    private volatile boolean flag = false;
    
    public void setFlag() {
        flag = true;
    }
    
    public void doWork() {
        while (!flag) {
            // 执行任务
        }
    }
}
```

### 3. 线程安全集合
```java
public class ThreadSafeCollections {
    // 线程安全列表
    private List<String> safeList = Collections.synchronizedList(new ArrayList<>());
    
    // 线程安全集合
    private Set<String> safeSet = Collections.synchronizedSet(new HashSet<>());
    
    // 线程安全映射
    private Map<String, String> safeMap = Collections.synchronizedMap(new HashMap<>());
}
```

## 线程通信

### 1. wait/notify
```java
public class WaitNotifyExample {
    private Object lock = new Object();
    private boolean isReady = false;
    
    public void producer() {
        synchronized (lock) {
            isReady = true;
            lock.notify();  // 通知等待的线程
        }
    }
    
    public void consumer() {
        synchronized (lock) {
            while (!isReady) {
                try {
                    lock.wait();  // 等待通知
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("收到通知");
        }
    }
}
```

### 2. 生产者消费者模式
```java
public class ProducerConsumer {
    private Queue<Integer> queue = new LinkedList<>();
    private int capacity = 10;
    
    public synchronized void produce(int item) throws InterruptedException {
        while (queue.size() == capacity) {
            wait();
        }
        queue.offer(item);
        notifyAll();
    }
    
    public synchronized int consume() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        int item = queue.poll();
        notifyAll();
        return item;
    }
}
```

## 线程池

### 1. 创建线程池
```java
public class ThreadPoolExample {
    // 创建固定大小的线程池
    private ExecutorService fixedPool = Executors.newFixedThreadPool(5);
    
    // 创建缓存线程池
    private ExecutorService cachedPool = Executors.newCachedThreadPool();
    
    // 创建单线程池
    private ExecutorService singlePool = Executors.newSingleThreadExecutor();
    
    // 创建定时任务线程池
    private ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(3);
}
```

### 2. 使用线程池
```java
public class ThreadPoolUsage {
    private ExecutorService executor = Executors.newFixedThreadPool(5);
    
    public void submitTask() {
        executor.submit(() -> {
            System.out.println("任务执行");
        });
    }
    
    public void shutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
```

## 最佳实践

### 1. 线程命名
```java
public class ThreadNaming {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            System.out.println("线程名称：" + Thread.currentThread().getName());
        }, "MyThread");  // 设置线程名称
        thread.start();
    }
}
```

### 2. 异常处理
```java
public class ThreadException {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            throw new RuntimeException("线程异常");
        });
        
        // 设置异常处理器
        thread.setUncaughtExceptionHandler((t, e) -> {
            System.out.println("线程 " + t.getName() + " 发生异常：" + e.getMessage());
        });
        
        thread.start();
    }
}
```

### 3. 线程安全设计
```java
public class ThreadSafeDesign {
    // 使用不可变对象
    private final String immutableString = "Hello";
    
    // 使用线程安全类
    private AtomicInteger counter = new AtomicInteger(0);
    
    // 使用线程本地变量
    private ThreadLocal<Integer> threadLocal = new ThreadLocal<>();
}
```

## 常见问题

### 1. 死锁
```java
public class DeadlockExample {
    private Object lock1 = new Object();
    private Object lock2 = new Object();
    
    public void method1() {
        synchronized (lock1) {
            synchronized (lock2) {
                // 执行操作
            }
        }
    }
    
    public void method2() {
        synchronized (lock2) {
            synchronized (lock1) {
                // 执行操作
            }
        }
    }
}
```

### 2. 活锁
```java
public class LivelockExample {
    private boolean flag = false;
    
    public void method1() {
        while (!flag) {
            flag = true;
            // 执行操作
        }
    }
    
    public void method2() {
        while (flag) {
            flag = false;
            // 执行操作
        }
    }
}
```

## 练习

1. 实现一个简单的生产者消费者模式
2. 编写一个线程安全的计数器
3. 实现一个简单的线程池

::: tip
建议多动手实践，通过实际项目来掌握线程编程。
:::

::: info 扩展阅读
- [Java 官方文档 - 并发编程](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
- [Java 并发编程实战](https://jcip.net/)
::: 