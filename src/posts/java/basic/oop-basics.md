---
title: Java 面向对象基础
icon: java
category:
  - Java 核心
tag:
  - Java
  - 面向对象
  - 基础
date: 2021-03-19
---

# Java 面向对象基础

## 面向对象编程概述

面向对象编程（Object-Oriented Programming，简称 OOP）是一种编程范式，它将数据和操作数据的方法封装在一起，形成一个对象。Java 是一个纯面向对象的编程语言，具有以下特点：

- 封装性
- 继承性
- 多态性
- 抽象性

## 类与对象

### 类的定义

类是创建对象的模板，它定义了对象的属性和行为。一个类包含：

- 成员变量（属性）
- 构造方法
- 成员方法（行为）

```java
public class Person {
    // 成员变量
    private String name;
    private int age;
    
    // 构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // 成员方法
    public void sayHello() {
        System.out.println("Hello, I am " + name);
    }
}
```

### 对象的创建和使用

对象是类的实例，通过 `new` 关键字创建：

```java
Person person = new Person("张三", 25);
person.sayHello();
```

## 封装

封装是将数据（属性）和操作数据的方法（行为）包装在一个类中，并对外隐藏实现细节。

### 访问修饰符

- `private`：只能在类内部访问
- `default`：只能在同一个包内访问
- `protected`：可以在同一个包内和子类中访问
- `public`：可以在任何地方访问

### getter 和 setter

```java
public class Person {
    private String name;
    
    // getter
    public String getName() {
        return name;
    }
    
    // setter
    public void setName(String name) {
        this.name = name;
    }
}
```

## 继承

继承允许我们基于现有的类创建新的类，新类继承现有类的属性和方法。

### 继承的语法

```java
public class Animal {
    protected String name;
    
    public void eat() {
        System.out.println("动物在吃东西");
    }
}

public class Dog extends Animal {
    public void bark() {
        System.out.println("汪汪汪");
    }
}
```

### 方法重写

子类可以重写父类的方法：

```java
public class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("狗在吃骨头");
    }
}
```

## 多态

多态是指同一个行为具有多个不同表现形式或形态的能力。

### 多态的实现方式

1. 方法重写
2. 接口实现
3. 抽象类和抽象方法

```java
public interface Animal {
    void makeSound();
}

public class Dog implements Animal {
    @Override
    public void makeSound() {
        System.out.println("汪汪汪");
    }
}

public class Cat implements Animal {
    @Override
    public void makeSound() {
        System.out.println("喵喵喵");
    }
}
```

## 抽象类与接口

### 抽象类

抽象类用 `abstract` 关键字声明，可以包含抽象方法和具体方法：

```java
public abstract class Shape {
    protected String color;
    
    // 抽象方法
    public abstract double getArea();
    
    // 具体方法
    public void setColor(String color) {
        this.color = color;
    }
}
```

### 接口

接口定义了一组抽象方法，实现类必须实现这些方法：

```java
public interface Flyable {
    void fly();
    void land();
}
```

## 包管理

包用于组织类和接口，避免命名冲突：

```java
package com.example;

public class MyClass {
    // 类的实现
}
```

## 最佳实践

1. **单一职责原则**
   - 一个类应该只有一个改变的理由
   - 类的职责应该单一

2. **开闭原则**
   - 对扩展开放，对修改关闭
   - 使用抽象类和接口

3. **里氏替换原则**
   - 子类必须能够替换父类
   - 保持继承关系的正确性

4. **接口隔离原则**
   - 接口应该小而专一
   - 避免胖接口

5. **依赖倒置原则**
   - 高层模块不应该依赖低层模块
   - 都应该依赖抽象

## 常见问题

1. **构造方法可以继承吗？**
   - 构造方法不能被继承
   - 子类必须调用父类的构造方法

2. **final 关键字的作用**
   - 修饰类：类不能被继承
   - 修饰方法：方法不能被重写
   - 修饰变量：变量变成常量

3. **static 关键字的作用**
   - 修饰成员变量：变成类变量
   - 修饰成员方法：变成类方法
   - 修饰代码块：变成静态代码块

## 练习

1. 创建一个 `Shape` 抽象类，包含计算面积和周长的方法
2. 创建 `Circle` 和 `Rectangle` 类继承 `Shape`
3. 实现一个简单的动物类继承体系

::: tip
建议动手实践这些概念，通过编写代码来加深理解。
:::

::: info 扩展阅读
- [Java 官方文档 - 类和对象](https://docs.oracle.com/javase/tutorial/java/javaOO/)
- [设计模式](https://refactoring.guru/design-patterns)
:::