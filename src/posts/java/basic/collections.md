---
title: Java 集合框架
icon: java
category:
  - Java 核心
tag:
  - Java
  - 集合
  - 框架
date: 2021-03-19
---

# Java 集合框架

## 集合框架概述

Java 集合框架（Java Collections Framework）是一个用于表示和操作集合的统一架构。它包含：

- 接口（Interfaces）
- 实现类（Implementations）
- 算法（Algorithms）

## 集合框架层次结构

### 1. Collection 接口
Collection 是集合框架的根接口，它定义了集合的基本操作：

```java
public interface Collection<E> {
    // 基本操作
    boolean add(E element);
    boolean remove(Object element);
    boolean contains(Object element);
    int size();
    boolean isEmpty();
    void clear();
    
    // 批量操作
    boolean addAll(Collection<? extends E> c);
    boolean removeAll(Collection<?> c);
    boolean retainAll(Collection<?> c);
    boolean containsAll(Collection<?> c);
    
    // 数组操作
    Object[] toArray();
    <T> T[] toArray(T[] a);
    
    // 迭代器
    Iterator<E> iterator();
}
```

### 2. List 接口
List 是一个有序集合，允许重复元素：

```java
public interface List<E> extends Collection<E> {
    // 位置访问
    E get(int index);
    E set(int index, E element);
    void add(int index, E element);
    E remove(int index);
    
    // 搜索
    int indexOf(Object o);
    int lastIndexOf(Object o);
    
    // 范围操作
    List<E> subList(int fromIndex, int toIndex);
}
```

### 3. Set 接口
Set 是一个不包含重复元素的集合：

```java
public interface Set<E> extends Collection<E> {
    // 继承自 Collection 接口
}
```

### 4. Queue 接口
Queue 是一个用于在处理之前保存元素的集合：

```java
public interface Queue<E> extends Collection<E> {
    // 插入
    boolean offer(E e);
    E add(E e);
    
    // 移除
    E remove();
    E poll();
    
    // 检查
    E element();
    E peek();
}
```

### 5. Map 接口
Map 是一个将键映射到值的对象：

```java
public interface Map<K,V> {
    // 基本操作
    V put(K key, V value);
    V get(Object key);
    V remove(Object key);
    boolean containsKey(Object key);
    boolean containsValue(Object value);
    int size();
    boolean isEmpty();
    void clear();
    
    // 批量操作
    void putAll(Map<? extends K, ? extends V> m);
    
    // 集合视图
    Set<K> keySet();
    Collection<V> values();
    Set<Map.Entry<K,V>> entrySet();
}
```

## 主要实现类

### 1. List 实现类

#### ArrayList
- 基于动态数组实现
- 支持随机访问
- 适合频繁读取操作

```java
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");
list.add("JavaScript");
```

#### LinkedList
- 基于双向链表实现
- 适合频繁插入和删除操作
- 实现了 Queue 接口

```java
List<String> list = new LinkedList<>();
list.add("First");
list.add("Last");
```

### 2. Set 实现类

#### HashSet
- 基于 HashMap 实现
- 不保证顺序
- 允许 null 元素

```java
Set<String> set = new HashSet<>();
set.add("Apple");
set.add("Banana");
set.add("Orange");
```

#### TreeSet
- 基于 TreeMap 实现
- 保证元素有序
- 不允许 null 元素

```java
Set<String> set = new TreeSet<>();
set.add("Zebra");
set.add("Apple");
set.add("Banana");
```

### 3. Queue 实现类

#### PriorityQueue
- 基于优先级堆的无界优先级队列
- 默认自然顺序排序

```java
Queue<Integer> queue = new PriorityQueue<>();
queue.offer(5);
queue.offer(2);
queue.offer(8);
```

#### ArrayDeque
- 基于数组的双端队列
- 可以作为栈或队列使用

```java
Deque<String> deque = new ArrayDeque<>();
deque.addFirst("First");
deque.addLast("Last");
```

### 4. Map 实现类

#### HashMap
- 基于哈希表实现
- 允许 null 键和值
- 不保证顺序

```java
Map<String, Integer> map = new HashMap<>();
map.put("Apple", 1);
map.put("Banana", 2);
```

#### TreeMap
- 基于红黑树实现
- 保证键有序
- 不允许 null 键

```java
Map<String, Integer> map = new TreeMap<>();
map.put("Zebra", 1);
map.put("Apple", 2);
```

## 集合工具类

### Collections 类
提供了一系列静态方法，用于操作集合：

```java
// 排序
Collections.sort(list);

// 反转
Collections.reverse(list);

// 随机打乱
Collections.shuffle(list);

// 查找最大最小值
Collections.max(collection);
Collections.min(collection);

// 填充
Collections.fill(list, "Default");

// 复制
Collections.copy(dest, src);
```

### Arrays 类
提供了一系列静态方法，用于操作数组：

```java
// 排序
Arrays.sort(array);

// 二分查找
Arrays.binarySearch(array, key);

// 填充
Arrays.fill(array, value);

// 复制
Arrays.copyOf(original, newLength);
```

## 线程安全集合

### 1. 同步包装器
```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Set<String> syncSet = Collections.synchronizedSet(new HashSet<>());
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());
```

### 2. 并发集合
```java
// 并发 List
List<String> concurrentList = new CopyOnWriteArrayList<>();

// 并发 Set
Set<String> concurrentSet = new ConcurrentHashSet<>();

// 并发 Map
Map<String, Integer> concurrentMap = new ConcurrentHashMap<>();
```

## 最佳实践

1. **选择合适的集合类型**
   - 需要有序集合：使用 List
   - 需要唯一元素：使用 Set
   - 需要键值对：使用 Map
   - 需要先进先出：使用 Queue

2. **考虑线程安全**
   - 单线程环境：使用非线程安全集合
   - 多线程环境：使用线程安全集合

3. **性能考虑**
   - 频繁读取：使用 ArrayList
   - 频繁插入删除：使用 LinkedList
   - 需要排序：使用 TreeSet/TreeMap
   - 需要快速查找：使用 HashSet/HashMap

## 常见问题

1. **ArrayList vs LinkedList**
   - ArrayList：适合随机访问，不适合频繁插入删除
   - LinkedList：适合频繁插入删除，不适合随机访问

2. **HashMap vs TreeMap**
   - HashMap：无序，性能更好
   - TreeMap：有序，性能较差

3. **HashSet vs TreeSet**
   - HashSet：无序，性能更好
   - TreeSet：有序，性能较差

## 练习

1. 实现一个简单的电话簿，使用 HashMap 存储联系人信息
2. 使用 ArrayList 实现一个简单的待办事项列表
3. 使用 PriorityQueue 实现一个任务调度系统

::: tip
建议多动手实践，通过实际项目来掌握集合框架的使用。
:::

::: info 扩展阅读
- [Java 官方文档 - 集合框架](https://docs.oracle.com/javase/tutorial/collections/)
- [Java 集合框架源码分析](https://github.com/CarpenterLee/JCFInternals)
:::