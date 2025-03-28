---
title: Java 基础语法
icon: java
category:
  - Java 核心
tag:
  - Java
  - 语法
  - 基础
date: 2021-03-19
---

# Java 基础语法

## 基本语法规则

### 1. 大小写敏感
Java 是大小写敏感的语言，例如 `Hello` 和 `hello` 是不同的标识符。

### 2. 类名
- 类名应该以大写字母开头
- 如果类名包含多个单词，每个单词的首字母都应该大写
- 例如：`MyFirstJavaClass`

### 3. 方法名
- 方法名应该以小写字母开头
- 如果方法名包含多个单词，第一个单词首字母小写，后面的单词首字母大写
- 例如：`calculateTotal`

### 4. 源文件名
- 源文件名必须和类名相同
- 文件扩展名必须是 `.java`
- 例如：`HelloWorld.java`

### 5. 主方法入口
所有的 Java 程序都由 `public static void main(String[] args)` 方法开始执行。

## 基本数据类型

### 1. 整数类型
```java
byte b = 127;        // 1字节
short s = 32767;     // 2字节
int i = 2147483647;  // 4字节
long l = 9223372036854775807L;  // 8字节
```

### 2. 浮点类型
```java
float f = 3.14f;     // 4字节
double d = 3.14159;  // 8字节
```

### 3. 字符类型
```java
char c = 'A';        // 2字节
```

### 4. 布尔类型
```java
boolean bool = true; // 1字节
```

## 变量声明

### 1. 变量命名规则
- 以字母、下划线或美元符号开头
- 后面可以跟字母、数字、下划线或美元符号
- 区分大小写
- 不能使用关键字

### 2. 变量声明方式
```java
// 声明并初始化
int number = 10;

// 先声明后初始化
int number;
number = 10;

// 多变量声明
int a, b, c;
```

## 运算符

### 1. 算术运算符
```java
int a = 10;
int b = 3;

int sum = a + b;      // 加法
int diff = a - b;     // 减法
int product = a * b;  // 乘法
int quotient = a / b; // 除法
int remainder = a % b;// 取余
```

### 2. 关系运算符
```java
boolean isEqual = a == b;     // 等于
boolean isNotEqual = a != b;  // 不等于
boolean isGreater = a > b;    // 大于
boolean isLess = a < b;       // 小于
boolean isGreaterOrEqual = a >= b; // 大于等于
boolean isLessOrEqual = a <= b;    // 小于等于
```

### 3. 逻辑运算符
```java
boolean a = true;
boolean b = false;

boolean and = a && b;  // 逻辑与
boolean or = a || b;   // 逻辑或
boolean not = !a;      // 逻辑非
```

### 4. 赋值运算符
```java
int a = 10;    // 基本赋值
a += 5;        // 加等于
a -= 3;        // 减等于
a *= 2;        // 乘等于
a /= 2;        // 除等于
a %= 3;        // 模等于
```

## 控制流程

### 1. if-else 语句
```java
if (condition) {
    // 代码块
} else if (anotherCondition) {
    // 代码块
} else {
    // 代码块
}
```

### 2. switch 语句
```java
switch (expression) {
    case value1:
        // 代码块
        break;
    case value2:
        // 代码块
        break;
    default:
        // 代码块
}
```

### 3. for 循环
```java
// 标准 for 循环
for (int i = 0; i < 10; i++) {
    // 代码块
}

// 增强型 for 循环
for (String item : items) {
    // 代码块
}
```

### 4. while 循环
```java
while (condition) {
    // 代码块
}

do {
    // 代码块
} while (condition);
```

## 数组

### 1. 数组声明和初始化
```java
// 声明数组
int[] numbers;

// 创建数组
numbers = new int[5];

// 声明并初始化
int[] numbers = {1, 2, 3, 4, 5};

// 二维数组
int[][] matrix = new int[3][3];
```

### 2. 数组操作
```java
// 获取数组长度
int length = numbers.length;

// 访问数组元素
int first = numbers[0];

// 修改数组元素
numbers[0] = 10;

// 遍历数组
for (int number : numbers) {
    System.out.println(number);
}
```

## 方法

### 1. 方法定义
```java
public static int add(int a, int b) {
    return a + b;
}
```

### 2. 方法重载
```java
public static int add(int a, int b) {
    return a + b;
}

public static double add(double a, double b) {
    return a + b;
}
```

## 异常处理

### 1. try-catch 语句
```java
try {
    // 可能抛出异常的代码
} catch (ExceptionType e) {
    // 处理异常
} finally {
    // 总是执行的代码
}
```

### 2. throws 关键字
```java
public void method() throws IOException {
    // 可能抛出 IOException 的代码
}
```

## 注释

### 1. 单行注释
```java
// 这是单行注释
```

### 2. 多行注释
```java
/* 这是多行注释
   可以写多行 */
```

### 3. 文档注释
```java
/**
 * 这是文档注释
 * @param param1 参数1的描述
 * @return 返回值的描述
 */
```

## 练习

1. 编写一个程序，计算 1 到 100 的和
2. 实现一个简单的计算器，支持基本的算术运算
3. 编写一个程序，判断一个数是否为素数

::: tip
建议多动手练习，通过编写代码来掌握这些语法规则。
:::

::: info 扩展阅读
- [Java 官方文档 - 基本语法](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/)
- [Java 编程规范](https://www.oracle.com/java/technologies/javase/codeconventions-contents.html)
:::