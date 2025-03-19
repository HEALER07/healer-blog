---
title: Java 线程安全与锁机制
icon: java
category:
  - Java 核心
tag:
  - Java
  - 线程安全
  - 锁机制
date: 2024-03-19
---

# Java 线程安全与锁机制

## 线程安全概述

线程安全是指当多个线程访问同一个对象时，如果不用考虑这些线程在运行时环境下的调度和交替执行，也不需要进行额外的同步，或者在调用方进行任何其他的协调操作，调用这个对象的行为都可以获得正确的结果。

### 1. 线程安全级别
```java
public class ThreadSafetyLevels {
    // 不可变对象 - 线程安全
    private final String immutableString = "Hello";
    
    // 无状态对象 - 线程安全
    public class StatelessService {
        public int add(int a, int b) {
            return a + b;
        }
    }
    
    // 有状态对象 - 需要同步
    public class StatefulService {
        private int counter = 0;
        
        public synchronized void increment() {
            counter++;
        }
    }
}
```

### 2. 线程安全实现方式
```java
public class ThreadSafetyImplementation {
    // 1. 不可变对象
    private final List<String> immutableList = Collections.unmodifiableList(new ArrayList<>());
    
    // 2. 线程安全类
    private AtomicInteger atomicCounter = new AtomicInteger(0);
    
    // 3. 同步方法
    private synchronized void synchronizedMethod() {
        // 线程安全的代码
    }
    
    // 4. 同步代码块
    private void synchronizedBlock() {
        synchronized (this) {
            // 线程安全的代码
        }
    }
}
```

## synchronized 关键字

### 1. 同步方法
```java
public class SynchronizedMethod {
    private int count = 0;
    
    // 实例方法同步
    public synchronized void instanceMethod() {
        count++;
        System.out.println("Count: " + count);
    }
    
    // 静态方法同步
    public static synchronized void staticMethod() {
        // 静态方法同步
    }
}
```

### 2. 同步代码块
```java
public class SynchronizedBlock {
    private int count = 0;
    private Object lock = new Object();
    
    public void method1() {
        synchronized (lock) {
            count++;
            System.out.println("Count: " + count);
        }
    }
    
    public void method2() {
        synchronized (this) {
            count--;
            System.out.println("Count: " + count);
        }
    }
}
```

### 3. 类锁和对象锁
```java
public class LockTypes {
    // 对象锁
    public synchronized void instanceLock() {
        // 同步代码
    }
    
    // 类锁
    public static synchronized void classLock() {
        // 同步代码
    }
    
    // 类锁的另一种形式
    public void anotherClassLock() {
        synchronized (LockTypes.class) {
            // 同步代码
        }
    }
}
```

## ReentrantLock

### 1. 基本使用
```java
public class ReentrantLockExample {
    private ReentrantLock lock = new ReentrantLock();
    private int count = 0;
    
    public void increment() {
        lock.lock();
        try {
            count++;
            System.out.println("Count: " + count);
        } finally {
            lock.unlock();
        }
    }
}
```

### 2. 可中断锁
```java
public class InterruptibleLock {
    private ReentrantLock lock = new ReentrantLock();
    
    public void method1() throws InterruptedException {
        lock.lockInterruptibly();
        try {
            // 执行操作
        } finally {
            lock.unlock();
        }
    }
    
    public void method2() {
        Thread thread = new Thread(() -> {
            try {
                method1();
            } catch (InterruptedException e) {
                System.out.println("线程被中断");
            }
        });
        
        thread.start();
        thread.interrupt();
    }
}
```

### 3. 公平锁
```java
public class FairLock {
    // 创建公平锁
    private ReentrantLock fairLock = new ReentrantLock(true);
    
    public void method() {
        fairLock.lock();
        try {
            // 执行操作
        } finally {
            fairLock.unlock();
        }
    }
}
```

## 读写锁

### 1. ReentrantReadWriteLock
```java
public class ReadWriteLockExample {
    private ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    private ReentrantReadWriteLock.ReadLock readLock = rwLock.readLock();
    private ReentrantReadWriteLock.WriteLock writeLock = rwLock.writeLock();
    private Map<String, String> cache = new HashMap<>();
    
    public String read(String key) {
        readLock.lock();
        try {
            return cache.get(key);
        } finally {
            readLock.unlock();
        }
    }
    
    public void write(String key, String value) {
        writeLock.lock();
        try {
            cache.put(key, value);
        } finally {
            writeLock.unlock();
        }
    }
}
```

### 2. 读写锁升级
```java
public class ReadWriteLockUpgrade {
    private ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    
    public void upgrade() {
        rwLock.readLock().lock();
        try {
            // 读操作
            if (needToWrite()) {
                rwLock.readLock().unlock();
                rwLock.writeLock().lock();
                try {
                    // 写操作
                } finally {
                    rwLock.writeLock().unlock();
                }
                rwLock.readLock().lock();
            }
        } finally {
            rwLock.readLock().unlock();
        }
    }
}
```

## 原子类

### 1. 基本原子类
```java
public class AtomicClasses {
    private AtomicInteger atomicInt = new AtomicInteger(0);
    private AtomicLong atomicLong = new AtomicLong(0L);
    private AtomicBoolean atomicBoolean = new AtomicBoolean(false);
    
    public void increment() {
        atomicInt.incrementAndGet();
        atomicLong.incrementAndGet();
        atomicBoolean.set(true);
    }
}
```

### 2. 数组原子类
```java
public class AtomicArrays {
    private AtomicIntegerArray atomicArray = new AtomicIntegerArray(10);
    private AtomicLongArray atomicLongArray = new AtomicLongArray(10);
    private AtomicReferenceArray<String> atomicRefArray = new AtomicReferenceArray<>(10);
    
    public void updateArray() {
        atomicArray.incrementAndGet(0);
        atomicLongArray.incrementAndGet(0);
        atomicRefArray.set(0, "Hello");
    }
}
```

### 3. 引用原子类
```java
public class AtomicReferences {
    private AtomicReference<String> atomicRef = new AtomicReference<>("Initial");
    private AtomicStampedReference<String> stampedRef = new AtomicStampedReference<>("Initial", 0);
    private AtomicMarkableReference<String> markableRef = new AtomicMarkableReference<>("Initial", false);
    
    public void updateReference() {
        atomicRef.compareAndSet("Initial", "Updated");
        stampedRef.compareAndSet("Initial", "Updated", 0, 1);
        markableRef.compareAndSet("Initial", "Updated", false, true);
    }
}
```

## 线程安全集合

### 1. 并发集合
```java
public class ConcurrentCollections {
    // 并发 List
    private List<String> concurrentList = new CopyOnWriteArrayList<>();
    
    // 并发 Set
    private Set<String> concurrentSet = new ConcurrentHashSet<>();
    
    // 并发 Map
    private Map<String, String> concurrentMap = new ConcurrentHashMap<>();
    
    // 并发队列
    private Queue<String> concurrentQueue = new ConcurrentLinkedQueue<>();
}
```

### 2. 阻塞队列
```java
public class BlockingQueues {
    // 有界阻塞队列
    private BlockingQueue<String> boundedQueue = new ArrayBlockingQueue<>(10);
    
    // 无界阻塞队列
    private BlockingQueue<String> unboundedQueue = new LinkedBlockingQueue<>();
    
    // 优先级阻塞队列
    private BlockingQueue<String> priorityQueue = new PriorityBlockingQueue<>();
    
    // 延迟队列
    private BlockingQueue<Delayed> delayedQueue = new DelayQueue<>();
}
```

## 最佳实践

### 1. 锁的选择
```java
public class LockSelection {
    // 1. 简单同步使用 synchronized
    private synchronized void simpleSync() {
        // 简单同步代码
    }
    
    // 2. 需要高级特性使用 ReentrantLock
    private ReentrantLock lock = new ReentrantLock();
    private void advancedSync() {
        if (lock.tryLock()) {
            try {
                // 高级同步代码
            } finally {
                lock.unlock();
            }
        }
    }
    
    // 3. 读写分离使用 ReadWriteLock
    private ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    private void readWriteSync() {
        rwLock.readLock().lock();
        try {
            // 读操作
        } finally {
            rwLock.readLock().unlock();
        }
    }
}
```

### 2. 避免死锁
```java
public class DeadlockPrevention {
    private Object lock1 = new Object();
    private Object lock2 = new Object();
    
    public void method1() {
        // 1. 固定锁的获取顺序
        synchronized (lock1) {
            synchronized (lock2) {
                // 执行操作
            }
        }
    }
    
    public void method2() {
        // 2. 使用 tryLock
        ReentrantLock lock = new ReentrantLock();
        if (lock.tryLock()) {
            try {
                // 执行操作
            } finally {
                lock.unlock();
            }
        }
    }
}
```

### 3. 性能优化
```java
public class LockOptimization {
    // 1. 使用细粒度锁
    private final Object[] locks = new Object[10];
    
    public void method(int index) {
        synchronized (locks[index % 10]) {
            // 执行操作
        }
    }
    
    // 2. 使用读写锁
    private ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    
    public void read() {
        rwLock.readLock().lock();
        try {
            // 读操作
        } finally {
            rwLock.readLock().unlock();
        }
    }
    
    // 3. 使用原子类
    private AtomicInteger counter = new AtomicInteger(0);
    
    public void increment() {
        counter.incrementAndGet();
    }
}
```

## 常见问题

### 1. 锁的粒度
```java
public class LockGranularity {
    // 粗粒度锁
    public synchronized void coarseGrained() {
        // 大量代码
    }
    
    // 细粒度锁
    private final Object[] locks = new Object[10];
    
    public void fineGrained(int index) {
        synchronized (locks[index % 10]) {
            // 少量代码
        }
    }
}
```

### 2. 锁的升级
```java
public class LockUpgrade {
    private ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    
    public void upgrade() {
        rwLock.readLock().lock();
        try {
            if (needToWrite()) {
                rwLock.readLock().unlock();
                rwLock.writeLock().lock();
                try {
                    // 写操作
                } finally {
                    rwLock.writeLock().unlock();
                }
                rwLock.readLock().lock();
            }
        } finally {
            rwLock.readLock().unlock();
        }
    }
}
```

## 练习

1. 实现一个线程安全的 LRU 缓存
2. 编写一个生产者消费者模式，使用不同的锁机制
3. 实现一个简单的线程池，包含任务队列和线程管理

::: tip
建议多动手实践，通过实际项目来掌握线程安全和锁机制。
:::

::: info 扩展阅读
- [Java 并发编程实战](https://jcip.net/)
- [Java 官方文档 - 并发编程](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
::: 