 ---
title: Java IO/NIO
icon: java
category:
  - Java 核心
tag:
  - Java
  - IO
  - NIO
date: 2024-03-19
---

# Java IO/NIO

## IO 概述

Java IO（Input/Output）是 Java 中用于处理输入输出的 API。它主要分为：

- 字节流（Byte Streams）
- 字符流（Character Streams）
- 缓冲流（Buffered Streams）
- 数据流（Data Streams）
- 对象流（Object Streams）

## 字节流

### 1. InputStream
字节输入流的基类：

```java
public abstract class InputStream {
    // 读取单个字节
    public abstract int read() throws IOException;
    
    // 读取字节数组
    public int read(byte[] b) throws IOException;
    
    // 读取指定长度的字节
    public int read(byte[] b, int off, int len) throws IOException;
    
    // 关闭流
    public void close() throws IOException;
}
```

### 2. OutputStream
字节输出流的基类：

```java
public abstract class OutputStream {
    // 写入单个字节
    public abstract void write(int b) throws IOException;
    
    // 写入字节数组
    public void write(byte[] b) throws IOException;
    
    // 写入指定长度的字节
    public void write(byte[] b, int off, int len) throws IOException;
    
    // 刷新缓冲区
    public void flush() throws IOException;
    
    // 关闭流
    public void close() throws IOException;
}
```

### 3. 文件流
```java
// 文件输入流
FileInputStream fis = new FileInputStream("input.txt");
try {
    int data;
    while ((data = fis.read()) != -1) {
        // 处理数据
    }
} finally {
    fis.close();
}

// 文件输出流
FileOutputStream fos = new FileOutputStream("output.txt");
try {
    fos.write("Hello World".getBytes());
    fos.flush();
} finally {
    fos.close();
}
```

## 字符流

### 1. Reader
字符输入流的基类：

```java
public abstract class Reader {
    // 读取单个字符
    public int read() throws IOException;
    
    // 读取字符数组
    public int read(char[] cbuf) throws IOException;
    
    // 读取指定长度的字符
    public int read(char[] cbuf, int off, int len) throws IOException;
    
    // 关闭流
    public void close() throws IOException;
}
```

### 2. Writer
字符输出流的基类：

```java
public abstract class Writer {
    // 写入单个字符
    public void write(int c) throws IOException;
    
    // 写入字符数组
    public void write(char[] cbuf) throws IOException;
    
    // 写入字符串
    public void write(String str) throws IOException;
    
    // 刷新缓冲区
    public void flush() throws IOException;
    
    // 关闭流
    public void close() throws IOException;
}
```

### 3. 文件字符流
```java
// 文件读取器
FileReader reader = new FileReader("input.txt");
try {
    int data;
    while ((data = reader.read()) != -1) {
        // 处理数据
    }
} finally {
    reader.close();
}

// 文件写入器
FileWriter writer = new FileWriter("output.txt");
try {
    writer.write("Hello World");
    writer.flush();
} finally {
    writer.close();
}
```

## 缓冲流

### 1. BufferedInputStream
```java
BufferedInputStream bis = new BufferedInputStream(
    new FileInputStream("input.txt")
);
try {
    int data;
    while ((data = bis.read()) != -1) {
        // 处理数据
    }
} finally {
    bis.close();
}
```

### 2. BufferedOutputStream
```java
BufferedOutputStream bos = new BufferedOutputStream(
    new FileOutputStream("output.txt")
);
try {
    bos.write("Hello World".getBytes());
    bos.flush();
} finally {
    bos.close();
}
```

### 3. BufferedReader
```java
BufferedReader reader = new BufferedReader(
    new FileReader("input.txt")
);
try {
    String line;
    while ((line = reader.readLine()) != null) {
        // 处理行数据
    }
} finally {
    reader.close();
}
```

### 4. BufferedWriter
```java
BufferedWriter writer = new BufferedWriter(
    new FileWriter("output.txt")
);
try {
    writer.write("Hello World");
    writer.newLine();
    writer.flush();
} finally {
    writer.close();
}
```

## NIO 概述

NIO（New IO）是 Java 1.4 引入的新 IO API，提供了：

- 缓冲区（Buffers）
- 通道（Channels）
- 选择器（Selectors）

### 1. 缓冲区
```java
// 创建缓冲区
ByteBuffer buffer = ByteBuffer.allocate(1024);

// 写入数据
buffer.put("Hello World".getBytes());

// 切换到读模式
buffer.flip();

// 读取数据
byte[] data = new byte[buffer.remaining()];
buffer.get(data);

// 清空缓冲区
buffer.clear();
```

### 2. 通道
```java
// 文件通道
FileChannel channel = FileChannel.open(
    Paths.get("input.txt"),
    StandardOpenOption.READ
);

// 读取数据
ByteBuffer buffer = ByteBuffer.allocate(1024);
while (channel.read(buffer) != -1) {
    buffer.flip();
    // 处理数据
    buffer.clear();
}

// 关闭通道
channel.close();
```

### 3. 选择器
```java
// 创建选择器
Selector selector = Selector.open();

// 注册通道
ServerSocketChannel serverChannel = ServerSocketChannel.open();
serverChannel.configureBlocking(false);
serverChannel.register(selector, SelectionKey.OP_ACCEPT);

// 选择就绪的通道
while (selector.select() > 0) {
    Set<SelectionKey> keys = selector.selectedKeys();
    for (SelectionKey key : keys) {
        if (key.isAcceptable()) {
            // 处理接受连接
        } else if (key.isReadable()) {
            // 处理读取数据
        } else if (key.isWritable()) {
            // 处理写入数据
        }
        keys.remove(key);
    }
}
```

## 文件操作

### 1. 文件复制
```java
// 使用 NIO 复制文件
Path source = Paths.get("source.txt");
Path target = Paths.get("target.txt");
Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
```

### 2. 文件移动
```java
// 移动文件
Path source = Paths.get("source.txt");
Path target = Paths.get("target.txt");
Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
```

### 3. 文件删除
```java
// 删除文件
Path path = Paths.get("file.txt");
Files.delete(path);
```

## 序列化

### 1. 对象序列化
```java
// 序列化对象
ObjectOutputStream oos = new ObjectOutputStream(
    new FileOutputStream("object.dat")
);
try {
    oos.writeObject(new Person("John", 30));
} finally {
    oos.close();
}
```

### 2. 对象反序列化
```java
// 反序列化对象
ObjectInputStream ois = new ObjectInputStream(
    new FileInputStream("object.dat")
);
try {
    Person person = (Person) ois.readObject();
} finally {
    ois.close();
}
```

## 最佳实践

1. **使用 try-with-resources**
```java
try (FileInputStream fis = new FileInputStream("input.txt")) {
    // 使用流
} catch (IOException e) {
    e.printStackTrace();
}
```

2. **使用缓冲流提高性能**
```java
try (BufferedReader reader = new BufferedReader(
        new FileReader("input.txt"))) {
    // 使用缓冲流
}
```

3. **正确处理字符编码**
```java
try (InputStreamReader reader = new InputStreamReader(
        new FileInputStream("input.txt"), "UTF-8")) {
    // 使用指定编码的读取器
}
```

## 常见问题

1. **流未关闭**
   - 使用 try-with-resources 自动关闭流
   - 在 finally 块中手动关闭流

2. **字符编码问题**
   - 明确指定字符编码
   - 使用 InputStreamReader 和 OutputStreamWriter

3. **性能问题**
   - 使用缓冲流
   - 使用 NIO 进行大文件操作

## 练习

1. 实现一个简单的文件复制工具
2. 编写一个日志文件分析器
3. 实现一个简单的聊天服务器

::: tip
建议多动手实践，通过实际项目来掌握 IO/NIO 的使用。
:::

::: info 扩展阅读
- [Java 官方文档 - IO](https://docs.oracle.com/javase/tutorial/essential/io/)
- [Java NIO 教程](https://jenkov.com/tutorials/java-nio/index.html)
:::