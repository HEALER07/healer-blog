---
title: CompletableFuture
icon: daily
category:
  - Java
tag:
  - daily
  - 异步任务执行
date: 2022-07-19
---

# CompletableFuture 全面解析

`CompletableFuture` 是 Java 8 引入的一个强大的异步编程工具类，它结合了 `Future` 和 `CompletionStage` 的特性，提供了更灵活的异步任务执行和结果处理能力。以下是对其全面解析：

---

## 一、CompletableFuture 简介

### 1. 定义
`CompletableFuture` 是一个实现 `Future` 和 `CompletionStage` 接口的类，用于表示异步计算的结果，并支持链式调用和组合操作。

### 2. 核心功能
- **异步任务执行**：支持将任务提交到线程池中异步执行。
- **结果处理**：提供丰富的回调方法（如 `thenApply`、`thenAccept` 等）对任务结果进行处理。
- **异常处理**：通过 `exceptionally` 或 `handle` 方法捕获并处理任务中的异常。
- **组合操作**：支持多个异步任务的组合（如 `thenCombine`、`thenCompose` 等）。

---

## 二、常用方法分类

### 1. 创建 CompletableFuture
- **静态方法**：
  - `runAsync(Runnable)`：无返回值的异步任务。
  - `runAsync(Runnable, Executor)`：指定线程池的无返回值异步任务。
  - `supplyAsync(Supplier<U>)`：有返回值的异步任务。
  - `supplyAsync(Supplier<U>, Executor)`：指定线程池的有返回值异步任务。

### 2. 结果处理
- **消费型**：
  - `thenAccept(Consumer)`：接受任务结果并执行操作，无返回值。
- **转换型**：
  - `thenApply(Function)`：将任务结果转换为另一个结果。
- **执行型**：
  - `thenRun(Runnable)`：任务完成后执行一个无参数的操作。

### 3. 异常处理
- `exceptionally(Function<Throwable, T>)`：捕获任务中的异常并返回替代值。
- `handle(BiFunction<T, Throwable, U>)`：无论是否发生异常，都执行回调函数。

### 4. 组合操作
- **并行组合**：
  - `thenCombine(CompletionStage, BiFunction)`：将两个任务的结果合并。
- **串行组合**：
  - `thenCompose(Function)`：将当前任务的结果作为下一个任务的输入。
- **多任务组合**：
  - `allOf(CompletableFuture...)`：等待所有任务完成。
  - `anyOf(CompletableFuture...)`：等待任意一个任务完成。

### 5. 阻塞获取结果
- `get()`：阻塞等待任务完成并获取结果。
- `join()`：非检查异常版本的 `get()`。

---

## 三、工作原理

### 1. 核心机制
- **异步执行**：通过线程池（默认 `ForkJoinPool.commonPool` 或自定义线程池）执行任务。
- **状态管理**：维护任务的状态（如未完成、已完成、已取消等），并在状态变化时通知回调函数。
- **链式调用**：通过回调函数构建任务链，支持复杂的异步流程。

### 2. 执行流程
1. 创建 `CompletableFuture` 实例。
2. 提交任务到线程池中异步执行。
3. 注册回调函数，处理任务结果或异常。
4. 当任务完成时，触发回调函数，更新状态。

---

## 四、示例代码

### 1. 基本用法
```java 
import java.util.concurrent.CompletableFuture;
public class CompletableFutureExample { 
  public static void main(String[] args) throws Exception { 
    // 异步任务 
    CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> { 
        return "Hello, CompletableFuture!";
    });
    // 获取结果
    String result = future.get();
    System.out.println(result);
  }
}
```
### 2. 结果处理
```java
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello")
        .thenApply(s -> s + " World")// 转换结果 
        .thenApply(String::toUpperCase);// 再次转换
future.thenAccept(System.out::println); // 输出结果
```
### 3. 异常处理
```java 
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> { 
    if (true) throw new RuntimeException("Error occurred!"); 
    return "Success"; 
}).exceptionally(ex -> { 
    return "Recovered from: " + ex.getMessage(); 
});
future.thenAccept(System.out::println); // 输出 "Recovered from: Error occurred!"
```
### 4. 组合操作
```java 
CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> 10); 
CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> 20);
// 并行组合 
CompletableFuture<Void> combinedFuture = future1.thenCombine(future2, (a, b) -> a + b)
        .thenAccept(System.out::println); // 输出 30
```
---

## 五、优缺点分析

### 优点
- **异步编程支持**：提供强大的异步任务执行能力。
- **链式调用**：简化复杂的异步流程，代码更加简洁。
- **异常处理**：提供多种方式捕获和处理异常。
- **组合操作**：支持多个异步任务的组合，便于构建复杂的业务逻辑。

### 缺点
- **调试困难**：异步任务在不同线程中执行，增加了调试复杂性。
- **学习成本**：链式调用和回调机制需要一定时间理解。
- **资源管理**：使用自定义线程池时需注意关闭线程池，避免资源泄漏。

---

## 六、适用场景

1. **高并发场景**：如 Web 应用中的异步请求处理。
2. **复杂业务逻辑**：需要多个异步任务协作完成的场景。
3. **性能优化**：避免阻塞主线程，提升程序响应性。

---

## 七、总结

`CompletableFuture` 是 Java 中异步编程的重要工具，提供了丰富的 API 支持异步任务的创建、执行、结果处理和组合操作。虽然其链式调用和回调机制可能增加一定的学习成本，但在实际开发中合理使用可以显著提升程序的性能和可维护性。掌握其核心原理和常见用法，能够帮助开发者更好地应对异步编程挑战。
