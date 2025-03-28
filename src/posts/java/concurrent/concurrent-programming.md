---
title: Java 并发编程
icon: java
category:
  - Java 核心
tag:
  - Java
  - 并发
  - 多线程
date: 2021-03-19
---

# Java 并发编程

## 并发基础

### 1. 进程与线程
```java
public class ProcessAndThread {
    // 1. 进程
    public void processExample() {
        // 进程是操作系统分配资源的基本单位
        // 每个进程都有独立的地址空间
        // 进程间通信需要特殊的机制
    }
    
    // 2. 线程
    public void threadExample() {
        // 线程是 CPU 调度的基本单位
        // 同一进程的线程共享进程的资源
        // 线程间通信相对简单
    }
}
```

### 2. 线程状态
```java
public class ThreadState {
    public void threadStates() {
        // 1. NEW - 新建状态
        Thread t1 = new Thread(() -> {});
        
        // 2. RUNNABLE - 可运行状态
        t1.start();
        
        // 3. BLOCKED - 阻塞状态
        synchronized (this) {
            // 等待获取锁
        }
        
        // 4. WAITING - 等待状态
        synchronized (this) {
            this.wait();  // 等待其他线程通知
        }
        
        // 5. TIMED_WAITING - 超时等待状态
        Thread.sleep(1000);  // 等待指定时间
        
        // 6. TERMINATED - 终止状态
        // 线程执行完成
    }
}
```

### 3. 线程创建
```java
public class ThreadCreation {
    // 1. 继承 Thread 类
    public class MyThread extends Thread {
        @Override
        public void run() {
            System.out.println("MyThread running");
        }
    }
    
    // 2. 实现 Runnable 接口
    public class MyRunnable implements Runnable {
        @Override
        public void run() {
            System.out.println("MyRunnable running");
        }
    }
    
    // 3. 使用 Lambda 表达式
    public void lambdaThread() {
        Thread t = new Thread(() -> {
            System.out.println("Lambda thread running");
        });
    }
}
```

## 线程安全

### 1. 原子性
```java
public class Atomicity {
    // 1. 使用原子类
    private AtomicInteger counter = new AtomicInteger(0);
    
    public void increment() {
        counter.incrementAndGet();
    }
    
    // 2. 使用 synchronized
    private int count = 0;
    
    public synchronized void incrementCount() {
        count++;
    }
    
    // 3. 使用 volatile
    private volatile boolean flag = false;
    
    public void setFlag() {
        flag = true;
    }
}
```

### 2. 可见性
```java
public class Visibility {
    // 1. volatile 关键字
    private volatile boolean running = true;
    
    public void stop() {
        running = false;
    }
    
    // 2. synchronized 关键字
    private boolean flag = false;
    
    public synchronized void setFlag() {
        flag = true;
    }
    
    public synchronized boolean getFlag() {
        return flag;
    }
    
    // 3. final 关键字
    private final int value = 42;
}
```

### 3. 有序性
```java
public class Ordering {
    // 1. volatile 关键字
    private volatile int x = 0;
    private volatile int y = 0;
    
    // 2. synchronized 关键字
    public synchronized void method() {
        // 保证有序性
    }
    
    // 3. happens-before 规则
    public void happensBefore() {
        // 1. 程序顺序规则
        // 2. 锁规则
        // 3. volatile 规则
        // 4. 传递性规则
    }
}
```

## 线程同步

### 1. synchronized 关键字
```java
public class SynchronizedExample {
    // 1. 同步方法
    public synchronized void method1() {
        // 同步代码
    }
    
    // 2. 同步代码块
    public void method2() {
        synchronized (this) {
            // 同步代码
        }
    }
    
    // 3. 静态同步方法
    public static synchronized void method3() {
        // 同步代码
    }
}
```

### 2. Lock 接口
```java
public class LockExample {
    // 1. ReentrantLock
    private Lock lock = new ReentrantLock();
    
    public void method() {
        lock.lock();
        try {
            // 临界区代码
        } finally {
            lock.unlock();
        }
    }
    
    // 2. ReadWriteLock
    private ReadWriteLock rwLock = new ReentrantReadWriteLock();
    
    public void read() {
        rwLock.readLock().lock();
        try {
            // 读操作
        } finally {
            rwLock.readLock().unlock();
        }
    }
    
    public void write() {
        rwLock.writeLock().lock();
        try {
            // 写操作
        } finally {
            rwLock.writeLock().unlock();
        }
    }
}
```

### 3. 线程通信
```java
public class ThreadCommunication {
    // 1. wait/notify
    public class WaitNotify {
        private Object lock = new Object();
        
        public void waitMethod() throws InterruptedException {
            synchronized (lock) {
                lock.wait();
            }
        }
        
        public void notifyMethod() {
            synchronized (lock) {
                lock.notify();
            }
        }
    }
    
    // 2. Condition
    public class ConditionExample {
        private Lock lock = new ReentrantLock();
        private Condition condition = lock.newCondition();
        
        public void await() throws InterruptedException {
            lock.lock();
            try {
                condition.await();
            } finally {
                lock.unlock();
            }
        }
        
        public void signal() {
            lock.lock();
            try {
                condition.signal();
            } finally {
                lock.unlock();
            }
        }
    }
}
```

## 线程池

### 1. 线程池创建
```java
public class ThreadPoolCreation {
    // 1. 固定大小线程池
    ExecutorService fixedPool = Executors.newFixedThreadPool(5);
    
    // 2. 缓存线程池
    ExecutorService cachedPool = Executors.newCachedThreadPool();
    
    // 3. 单线程池
    ExecutorService singlePool = Executors.newSingleThreadExecutor();
    
    // 4. 定时线程池
    ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(3);
    
    // 5. 自定义线程池
    ThreadPoolExecutor customPool = new ThreadPoolExecutor(
        5,                      // 核心线程数
        10,                     // 最大线程数
        60L,                    // 空闲线程存活时间
        TimeUnit.SECONDS,       // 时间单位
        new LinkedBlockingQueue<>(100),  // 工作队列
        new ThreadFactory() {   // 线程工厂
            @Override
            public Thread newThread(Runnable r) {
                return new Thread(r);
            }
        },
        new ThreadPoolExecutor.CallerRunsPolicy()  // 拒绝策略
    );
}
```

### 2. 线程池使用
```java
public class ThreadPoolUsage {
    private ExecutorService executor = Executors.newFixedThreadPool(5);
    
    // 1. 提交任务
    public void submitTask() {
        // 提交 Runnable
        executor.submit(() -> {
            System.out.println("Task running");
        });
        
        // 提交 Callable
        Future<String> future = executor.submit(() -> {
            return "Task result";
        });
    }
    
    // 2. 关闭线程池
    public void shutdownPool() {
        // 优雅关闭
        executor.shutdown();
        
        // 立即关闭
        executor.shutdownNow();
    }
    
    // 3. 监控线程池
    public void monitorPool() {
        ThreadPoolExecutor pool = (ThreadPoolExecutor) executor;
        System.out.println("Active threads: " + pool.getActiveCount());
        System.out.println("Completed tasks: " + pool.getCompletedTaskCount());
        System.out.println("Total tasks: " + pool.getTaskCount());
    }
}
```

## 并发集合

### 1. 并发 List
```java
public class ConcurrentList {
    // 1. CopyOnWriteArrayList
    private List<String> list = new CopyOnWriteArrayList<>();
    
    public void add(String element) {
        list.add(element);
    }
    
    // 2. Collections.synchronizedList
    private List<String> syncList = Collections.synchronizedList(new ArrayList<>());
    
    public void addSync(String element) {
        syncList.add(element);
    }
}
```

### 2. 并发 Set
```java
public class ConcurrentSet {
    // 1. CopyOnWriteArraySet
    private Set<String> set = new CopyOnWriteArraySet<>();
    
    public void add(String element) {
        set.add(element);
    }
    
    // 2. ConcurrentSkipListSet
    private Set<String> skipSet = new ConcurrentSkipListSet<>();
    
    public void addSkip(String element) {
        skipSet.add(element);
    }
}
```

### 3. 并发 Map
```java
public class ConcurrentMap {
    // 1. ConcurrentHashMap
    private Map<String, String> map = new ConcurrentHashMap<>();
    
    public void put(String key, String value) {
        map.put(key, value);
    }
    
    // 2. ConcurrentSkipListMap
    private Map<String, String> skipMap = new ConcurrentSkipListMap<>();
    
    public void putSkip(String key, String value) {
        skipMap.put(key, value);
    }
}
```

## 原子类

### 1. 基本原子类
```java
public class AtomicBasic {
    // 1. AtomicInteger
    private AtomicInteger counter = new AtomicInteger(0);
    
    public void increment() {
        counter.incrementAndGet();
    }
    
    // 2. AtomicLong
    private AtomicLong longCounter = new AtomicLong(0L);
    
    public void incrementLong() {
        longCounter.incrementAndGet();
    }
    
    // 3. AtomicBoolean
    private AtomicBoolean flag = new AtomicBoolean(false);
    
    public void setFlag() {
        flag.set(true);
    }
}
```

### 2. 数组原子类
```java
public class AtomicArray {
    // 1. AtomicIntegerArray
    private AtomicIntegerArray intArray = new AtomicIntegerArray(10);
    
    public void setValue(int index, int value) {
        intArray.set(index, value);
    }
    
    // 2. AtomicLongArray
    private AtomicLongArray longArray = new AtomicLongArray(10);
    
    public void setLongValue(int index, long value) {
        longArray.set(index, value);
    }
}
```

### 3. 引用原子类
```java
public class AtomicReference {
    // 1. AtomicReference
    private AtomicReference<String> ref = new AtomicReference<>("initial");
    
    public void setValue(String value) {
        ref.set(value);
    }
    
    // 2. AtomicStampedReference
    private AtomicStampedReference<String> stampedRef = 
        new AtomicStampedReference<>("initial", 0);
    
    public void setStampedValue(String value) {
        stampedRef.set(value, stampedRef.getStamp() + 1);
    }
}
```

## 练习

1. 线程安全实践：
   - 实现一个线程安全的计数器
   - 实现一个线程安全的单例模式
   - 实现一个线程安全的缓存

2. 线程同步实践：
   - 实现生产者-消费者模式
   - 实现读者-写者模式
   - 实现哲学家进餐问题

3. 线程池实践：
   - 实现一个简单的线程池
   - 实现任务调度系统
   - 实现并发下载器

::: tip
并发编程需要特别注意线程安全、死锁、活锁等问题，建议多实践和测试。
:::

::: info 扩展阅读
- [Java Concurrency in Practice](https://jcip.net/)
- [Java 并发编程实战](https://book.douban.com/subject/10484692/)
:::