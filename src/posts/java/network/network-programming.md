---
title: Java 网络编程
icon: java
category:
  - Java 核心
tag:
  - Java
  - 网络编程
  - Socket
date: 2021-03-19
---

# Java 网络编程

## 网络基础

### 1. 网络协议
```java
public class NetworkProtocol {
    // 1. TCP/IP 协议
    public void tcpProtocol() {
        // TCP 是面向连接的协议
        // 提供可靠的数据传输
        // 有流量控制和拥塞控制
    }
    
    // 2. UDP 协议
    public void udpProtocol() {
        // UDP 是无连接的协议
        // 提供不可靠的数据传输
        // 传输速度快
    }
}
```

### 2. Socket 编程
```java
public class SocketProgramming {
    // 1. TCP Socket
    public class TCPSocket {
        // 服务器端
        public void server() throws IOException {
            ServerSocket serverSocket = new ServerSocket(8080);
            Socket socket = serverSocket.accept();
            
            // 读取数据
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(socket.getInputStream())
            );
            String message = reader.readLine();
            
            // 发送数据
            PrintWriter writer = new PrintWriter(
                socket.getOutputStream(), true
            );
            writer.println("Server response");
            
            socket.close();
            serverSocket.close();
        }
        
        // 客户端
        public void client() throws IOException {
            Socket socket = new Socket("localhost", 8080);
            
            // 发送数据
            PrintWriter writer = new PrintWriter(
                socket.getOutputStream(), true
            );
            writer.println("Hello server");
            
            // 读取数据
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(socket.getInputStream())
            );
            String response = reader.readLine();
            
            socket.close();
        }
    }
    
    // 2. UDP Socket
    public class UDPSocket {
        // 服务器端
        public void server() throws IOException {
            DatagramSocket socket = new DatagramSocket(8080);
            byte[] buffer = new byte[1024];
            
            // 接收数据
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            socket.receive(packet);
            
            // 发送数据
            InetAddress address = packet.getAddress();
            int port = packet.getPort();
            String response = "Server response";
            byte[] responseData = response.getBytes();
            DatagramPacket responsePacket = new DatagramPacket(
                responseData, responseData.length, address, port
            );
            socket.send(responsePacket);
            
            socket.close();
        }
        
        // 客户端
        public void client() throws IOException {
            DatagramSocket socket = new DatagramSocket();
            
            // 发送数据
            String message = "Hello server";
            byte[] data = message.getBytes();
            InetAddress address = InetAddress.getByName("localhost");
            DatagramPacket packet = new DatagramPacket(
                data, data.length, address, 8080
            );
            socket.send(packet);
            
            // 接收数据
            byte[] buffer = new byte[1024];
            DatagramPacket response = new DatagramPacket(buffer, buffer.length);
            socket.receive(response);
            
            socket.close();
        }
    }
}
```

## NIO 编程

### 1. Buffer
```java
public class BufferExample {
    public void bufferUsage() {
        // 1. 创建 Buffer
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        
        // 2. 写入数据
        buffer.put("Hello".getBytes());
        
        // 3. 切换模式
        buffer.flip();
        
        // 4. 读取数据
        byte[] data = new byte[buffer.remaining()];
        buffer.get(data);
        
        // 5. 清空 Buffer
        buffer.clear();
    }
}
```

### 2. Channel
```java
public class ChannelExample {
    // 1. FileChannel
    public void fileChannel() throws IOException {
        // 读取文件
        FileInputStream fis = new FileInputStream("input.txt");
        FileChannel channel = fis.getChannel();
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        channel.read(buffer);
        
        // 写入文件
        FileOutputStream fos = new FileOutputStream("output.txt");
        FileChannel outChannel = fos.getChannel();
        buffer.flip();
        outChannel.write(buffer);
    }
    
    // 2. SocketChannel
    public class SocketChannelExample {
        // 服务器端
        public void server() throws IOException {
            ServerSocketChannel serverChannel = ServerSocketChannel.open();
            serverChannel.socket().bind(new InetSocketAddress(8080));
            serverChannel.configureBlocking(false);
            
            while (true) {
                SocketChannel clientChannel = serverChannel.accept();
                if (clientChannel != null) {
                    // 处理客户端连接
                    ByteBuffer buffer = ByteBuffer.allocate(1024);
                    clientChannel.read(buffer);
                    buffer.flip();
                    clientChannel.write(buffer);
                }
            }
        }
        
        // 客户端
        public void client() throws IOException {
            SocketChannel channel = SocketChannel.open();
            channel.connect(new InetSocketAddress("localhost", 8080));
            
            // 发送数据
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            buffer.put("Hello server".getBytes());
            buffer.flip();
            channel.write(buffer);
            
            // 接收数据
            buffer.clear();
            channel.read(buffer);
        }
    }
}
```

### 3. Selector
```java
public class SelectorExample {
    public void selectorUsage() throws IOException {
        // 1. 创建 Selector
        Selector selector = Selector.open();
        
        // 2. 创建 Channel
        ServerSocketChannel serverChannel = ServerSocketChannel.open();
        serverChannel.socket().bind(new InetSocketAddress(8080));
        serverChannel.configureBlocking(false);
        
        // 3. 注册 Channel
        serverChannel.register(selector, SelectionKey.OP_ACCEPT);
        
        // 4. 选择就绪的 Channel
        while (true) {
            selector.select();
            Set<SelectionKey> keys = selector.selectedKeys();
            
            for (SelectionKey key : keys) {
                if (key.isAcceptable()) {
                    // 处理接受连接
                    ServerSocketChannel server = (ServerSocketChannel) key.channel();
                    SocketChannel client = server.accept();
                    client.configureBlocking(false);
                    client.register(selector, SelectionKey.OP_READ);
                } else if (key.isReadable()) {
                    // 处理读取数据
                    SocketChannel client = (SocketChannel) key.channel();
                    ByteBuffer buffer = ByteBuffer.allocate(1024);
                    client.read(buffer);
                }
            }
            keys.clear();
        }
    }
}
```

## 网络框架

### 1. Netty
```java
public class NettyExample {
    // 1. 服务器端
    public class NettyServer {
        public void start() throws Exception {
            EventLoopGroup bossGroup = new NioEventLoopGroup(1);
            EventLoopGroup workerGroup = new NioEventLoopGroup();
            
            try {
                ServerBootstrap bootstrap = new ServerBootstrap();
                bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new ServerHandler());
                        }
                    });
                
                ChannelFuture future = bootstrap.bind(8080).sync();
                future.channel().closeFuture().sync();
            } finally {
                bossGroup.shutdownGracefully();
                workerGroup.shutdownGracefully();
            }
        }
    }
    
    // 2. 客户端
    public class NettyClient {
        public void start() throws Exception {
            EventLoopGroup group = new NioEventLoopGroup();
            
            try {
                Bootstrap bootstrap = new Bootstrap();
                bootstrap.group(group)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new ClientHandler());
                        }
                    });
                
                ChannelFuture future = bootstrap.connect("localhost", 8080).sync();
                future.channel().closeFuture().sync();
            } finally {
                group.shutdownGracefully();
            }
        }
    }
}
```

### 2. Spring WebFlux
```java
public class WebFluxExample {
    // 1. 服务器端
    @Component
    public class WebFluxServer {
        public void start() {
            HttpServer.create()
                .port(8080)
                .route(routes -> routes
                    .get("/hello", (request, response) -> 
                        response.sendString(Mono.just("Hello WebFlux")))
                    .post("/echo", (request, response) -> 
                        response.send(request.receive().asString()))
                )
                .bindNow();
        }
    }
    
    // 2. 客户端
    public class WebFluxClient {
        public void start() {
            WebClient client = WebClient.create("http://localhost:8080");
            
            // GET 请求
            client.get()
                .uri("/hello")
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(System.out::println);
            
            // POST 请求
            client.post()
                .uri("/echo")
                .bodyValue("Hello Server")
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(System.out::println);
        }
    }
}
```

## 练习

1. Socket 编程实践：
   - 实现一个简单的聊天服务器
   - 实现一个文件传输程序
   - 实现一个 HTTP 服务器

2. NIO 编程实践：
   - 实现一个非阻塞的聊天服务器
   - 实现一个文件复制工具
   - 实现一个简单的代理服务器

3. 网络框架实践：
   - 使用 Netty 实现一个聊天室
   - 使用 WebFlux 实现一个 REST API
   - 实现一个简单的 RPC 框架

::: tip
网络编程需要注意并发处理、资源管理、异常处理等问题，建议多实践和测试。
:::

::: info 扩展阅读
- [Netty 官方文档](https://netty.io/)
- [Spring WebFlux 官方文档](https://docs.spring.io/spring-framework/reference/web/webflux.html)
:::