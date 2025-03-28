---
title: Java 设计模式
icon: java
category:
  - Java 核心
tag:
  - Java
  - 设计模式
  - 面向对象
date: 2021-03-19
---

# Java 设计模式

## 设计模式概述

设计模式是软件开发人员在软件开发过程中面临的一般问题的解决方案。这些解决方案是众多软件开发人员经过相当长的一段时间的试验和错误总结出来的。

### 1. 设计模式的分类
```java
public class DesignPatterns {
    // 1. 创建型模式
    // - 单例模式
    // - 工厂模式
    // - 抽象工厂模式
    // - 建造者模式
    // - 原型模式
    
    // 2. 结构型模式
    // - 适配器模式
    // - 桥接模式
    // - 组合模式
    // - 装饰器模式
    // - 外观模式
    // - 享元模式
    // - 代理模式
    
    // 3. 行为型模式
    // - 责任链模式
    // - 命令模式
    // - 解释器模式
    // - 迭代器模式
    // - 中介者模式
    // - 备忘录模式
    // - 观察者模式
    // - 状态模式
    // - 策略模式
    // - 模板方法模式
    // - 访问者模式
}
```

### 2. 设计模式的原则
```java
public class DesignPrinciples {
    // 1. 单一职责原则 (SRP)
    // 一个类应该只有一个引起它变化的原因
    
    // 2. 开闭原则 (OCP)
    // 软件实体应该对扩展开放，对修改关闭
    
    // 3. 里氏替换原则 (LSP)
    // 子类型必须能够替换它们的基类型
    
    // 4. 接口隔离原则 (ISP)
    // 使用多个专门的接口比使用单个总接口要好
    
    // 5. 依赖倒置原则 (DIP)
    // 高层模块不应该依赖低层模块，都应该依赖抽象
}
```

## 创建型模式

### 1. 单例模式
```java
public class Singleton {
    // 1. 饿汉式
    public class EagerSingleton {
        private static final EagerSingleton instance = new EagerSingleton();
        private EagerSingleton() {}
        public static EagerSingleton getInstance() {
            return instance;
        }
    }
    
    // 2. 懒汉式
    public class LazySingleton {
        private static volatile LazySingleton instance;
        private LazySingleton() {}
        public static LazySingleton getInstance() {
            if (instance == null) {
                synchronized (LazySingleton.class) {
                    if (instance == null) {
                        instance = new LazySingleton();
                    }
                }
            }
            return instance;
        }
    }
    
    // 3. 静态内部类
    public class StaticInnerSingleton {
        private StaticInnerSingleton() {}
        private static class SingletonHolder {
            private static final StaticInnerSingleton instance = new StaticInnerSingleton();
        }
        public static StaticInnerSingleton getInstance() {
            return SingletonHolder.instance;
        }
    }
}
```

### 2. 工厂模式
```java
public class FactoryPattern {
    // 1. 简单工厂
    public class SimpleFactory {
        public static Product createProduct(String type) {
            switch (type) {
                case "A":
                    return new ProductA();
                case "B":
                    return new ProductB();
                default:
                    throw new IllegalArgumentException("Unknown product type");
            }
        }
    }
    
    // 2. 工厂方法
    public interface Factory {
        Product createProduct();
    }
    
    public class FactoryA implements Factory {
        @Override
        public Product createProduct() {
            return new ProductA();
        }
    }
    
    public class FactoryB implements Factory {
        @Override
        public Product createProduct() {
            return new ProductB();
        }
    }
    
    // 3. 抽象工厂
    public interface AbstractFactory {
        ProductA createProductA();
        ProductB createProductB();
    }
    
    public class ConcreteFactory1 implements AbstractFactory {
        @Override
        public ProductA createProductA() {
            return new ProductA1();
        }
        
        @Override
        public ProductB createProductB() {
            return new ProductB1();
        }
    }
}
```

### 3. 建造者模式
```java
public class BuilderPattern {
    public class Computer {
        private String cpu;
        private String ram;
        private String storage;
        
        private Computer(Builder builder) {
            this.cpu = builder.cpu;
            this.ram = builder.ram;
            this.storage = builder.storage;
        }
        
        public static class Builder {
            private String cpu;
            private String ram;
            private String storage;
            
            public Builder setCpu(String cpu) {
                this.cpu = cpu;
                return this;
            }
            
            public Builder setRam(String ram) {
                this.ram = ram;
                return this;
            }
            
            public Builder setStorage(String storage) {
                this.storage = storage;
                return this;
            }
            
            public Computer build() {
                return new Computer(this);
            }
        }
    }
}
```

## 结构型模式

### 1. 适配器模式
```java
public class AdapterPattern {
    // 1. 类适配器
    public interface Target {
        void request();
    }
    
    public class Adaptee {
        public void specificRequest() {
            System.out.println("Specific request");
        }
    }
    
    public class ClassAdapter extends Adaptee implements Target {
        @Override
        public void request() {
            specificRequest();
        }
    }
    
    // 2. 对象适配器
    public class ObjectAdapter implements Target {
        private Adaptee adaptee;
        
        public ObjectAdapter(Adaptee adaptee) {
            this.adaptee = adaptee;
        }
        
        @Override
        public void request() {
            adaptee.specificRequest();
        }
    }
}
```

### 2. 装饰器模式
```java
public class DecoratorPattern {
    public interface Component {
        void operation();
    }
    
    public class ConcreteComponent implements Component {
        @Override
        public void operation() {
            System.out.println("Concrete Component");
        }
    }
    
    public abstract class Decorator implements Component {
        protected Component component;
        
        public Decorator(Component component) {
            this.component = component;
        }
        
        @Override
        public void operation() {
            component.operation();
        }
    }
    
    public class ConcreteDecorator extends Decorator {
        public ConcreteDecorator(Component component) {
            super(component);
        }
        
        @Override
        public void operation() {
            super.operation();
            addedBehavior();
        }
        
        private void addedBehavior() {
            System.out.println("Added Behavior");
        }
    }
}
```

### 3. 代理模式
```java
public class ProxyPattern {
    // 1. 静态代理
    public interface Subject {
        void request();
    }
    
    public class RealSubject implements Subject {
        @Override
        public void request() {
            System.out.println("Real Subject");
        }
    }
    
    public class StaticProxy implements Subject {
        private RealSubject realSubject;
        
        public StaticProxy() {
            this.realSubject = new RealSubject();
        }
        
        @Override
        public void request() {
            System.out.println("Before");
            realSubject.request();
            System.out.println("After");
        }
    }
    
    // 2. 动态代理
    public class DynamicProxy implements InvocationHandler {
        private Object target;
        
        public DynamicProxy(Object target) {
            this.target = target;
        }
        
        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            System.out.println("Before");
            Object result = method.invoke(target, args);
            System.out.println("After");
            return result;
        }
    }
}
```

## 行为型模式

### 1. 观察者模式
```java
public class ObserverPattern {
    public interface Observer {
        void update(String message);
    }
    
    public interface Subject {
        void registerObserver(Observer observer);
        void removeObserver(Observer observer);
        void notifyObservers();
    }
    
    public class ConcreteSubject implements Subject {
        private List<Observer> observers = new ArrayList<>();
        
        @Override
        public void registerObserver(Observer observer) {
            observers.add(observer);
        }
        
        @Override
        public void removeObserver(Observer observer) {
            observers.remove(observer);
        }
        
        @Override
        public void notifyObservers() {
            for (Observer observer : observers) {
                observer.update("New message");
            }
        }
    }
    
    public class ConcreteObserver implements Observer {
        @Override
        public void update(String message) {
            System.out.println("Received: " + message);
        }
    }
}
```

### 2. 策略模式
```java
public class StrategyPattern {
    public interface Strategy {
        void execute();
    }
    
    public class ConcreteStrategyA implements Strategy {
        @Override
        public void execute() {
            System.out.println("Strategy A");
        }
    }
    
    public class ConcreteStrategyB implements Strategy {
        @Override
        public void execute() {
            System.out.println("Strategy B");
        }
    }
    
    public class Context {
        private Strategy strategy;
        
        public Context(Strategy strategy) {
            this.strategy = strategy;
        }
        
        public void executeStrategy() {
            strategy.execute();
        }
        
        public void setStrategy(Strategy strategy) {
            this.strategy = strategy;
        }
    }
}
```

### 3. 模板方法模式
```java
public class TemplateMethodPattern {
    public abstract class AbstractClass {
        public final void templateMethod() {
            primitiveOperation1();
            primitiveOperation2();
            hook();
        }
        
        protected abstract void primitiveOperation1();
        protected abstract void primitiveOperation2();
        protected void hook() {}
    }
    
    public class ConcreteClass extends AbstractClass {
        @Override
        protected void primitiveOperation1() {
            System.out.println("Operation 1");
        }
        
        @Override
        protected void primitiveOperation2() {
            System.out.println("Operation 2");
        }
    }
}
```

## 设计模式应用

### 1. Spring 框架中的应用
```java
public class SpringPatterns {
    // 1. 单例模式
    @Component
    public class SingletonService {
        // Spring 默认使用单例模式
    }
    
    // 2. 工厂模式
    @Configuration
    public class FactoryConfig {
        @Bean
        public Product product() {
            return new ConcreteProduct();
        }
    }
    
    // 3. 代理模式
    @Aspect
    @Component
    public class LoggingAspect {
        @Around("execution(* com.example.*.*(..))")
        public Object log(ProceedingJoinPoint joinPoint) throws Throwable {
            // 实现日志记录
            return joinPoint.proceed();
        }
    }
}
```

### 2. 实际项目中的应用
```java
public class ProjectPatterns {
    // 1. 建造者模式
    public class User {
        private String username;
        private String email;
        private String password;
        
        private User(Builder builder) {
            this.username = builder.username;
            this.email = builder.email;
            this.password = builder.password;
        }
        
        public static class Builder {
            private String username;
            private String email;
            private String password;
            
            public Builder setUsername(String username) {
                this.username = username;
                return this;
            }
            
            public Builder setEmail(String email) {
                this.email = email;
                return this;
            }
            
            public Builder setPassword(String password) {
                this.password = password;
                return this;
            }
            
            public User build() {
                return new User(this);
            }
        }
    }
    
    // 2. 观察者模式
    public class EventBus {
        private Map<String, List<EventListener>> listeners = new HashMap<>();
        
        public void register(String eventType, EventListener listener) {
            listeners.computeIfAbsent(eventType, k -> new ArrayList<>()).add(listener);
        }
        
        public void fireEvent(String eventType, Object event) {
            List<EventListener> eventListeners = listeners.get(eventType);
            if (eventListeners != null) {
                for (EventListener listener : eventListeners) {
                    listener.onEvent(event);
                }
            }
        }
    }
}
```

## 设计模式选择

### 1. 选择原则
```java
public class PatternSelection {
    // 1. 根据问题类型选择
    public void selectByProblem() {
        // 创建对象 -> 创建型模式
        // 组合类或对象 -> 结构型模式
        // 算法和对象间职责分配 -> 行为型模式
    }
    
    // 2. 根据设计原则选择
    public void selectByPrinciple() {
        // 单一职责 -> 装饰器模式
        // 开闭原则 -> 策略模式
        // 接口隔离 -> 适配器模式
        // 依赖倒置 -> 工厂模式
    }
    
    // 3. 根据应用场景选择
    public void selectByScenario() {
        // 对象创建 -> 工厂模式
        // 对象组合 -> 组合模式
        // 对象行为 -> 观察者模式
        // 算法封装 -> 策略模式
    }
}
```

### 2. 常见误区
```java
public class CommonMistakes {
    // 1. 过度设计
    public void overDesign() {
        // 使用设计模式而不考虑实际需求
        // 增加系统复杂度
        // 降低代码可维护性
    }
    
    // 2. 模式滥用
    public void patternAbuse() {
        // 在不必要的地方使用设计模式
        // 使用不合适的模式
        // 模式组合不当
    }
    
    // 3. 实现不当
    public void improperImplementation() {
        // 违反设计模式原则
        // 实现过于复杂
        // 性能问题
    }
}
```

## 练习

1. 设计模式实践：
   - 实现一个简单的工厂模式
   - 实现一个观察者模式
   - 实现一个装饰器模式

2. 模式选择练习：
   - 分析实际项目中的设计模式使用
   - 评估模式选择的合理性
   - 提出优化建议

3. 模式组合练习：
   - 组合多个设计模式
   - 分析模式间的交互
   - 评估组合效果

::: tip
设计模式是解决特定问题的方案，不是万能的。要根据实际需求选择合适的模式。
:::

::: info 扩展阅读
- [Design Patterns](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/)
- [Head First Design Patterns](https://www.oreilly.com/library/view/head-first-design/0596007124/)
:::