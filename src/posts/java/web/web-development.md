---
title: Java Web 开发
icon: java
category:
  - Java 核心
tag:
  - Java
  - Web
  - Servlet
date: 2024-03-19
---

# Java Web 开发

## Servlet 基础

### 1. Servlet 生命周期
```java
public class LifecycleServlet extends HttpServlet {
    // 1. 初始化
    @Override
    public void init() throws ServletException {
        // 在 Servlet 实例化后，服务之前调用
        System.out.println("Servlet initialized");
    }
    
    // 2. 服务
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        // 处理请求
        String method = req.getMethod();
        if ("GET".equals(method)) {
            doGet(req, resp);
        } else if ("POST".equals(method)) {
            doPost(req, resp);
        }
    }
    
    // 3. 销毁
    @Override
    public void destroy() {
        // 在 Servlet 被销毁之前调用
        System.out.println("Servlet destroyed");
    }
}
```

### 2. 请求处理
```java
public class RequestServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        // 1. 获取请求参数
        String name = req.getParameter("name");
        String[] hobbies = req.getParameterValues("hobby");
        
        // 2. 获取请求头
        String userAgent = req.getHeader("User-Agent");
        
        // 3. 获取请求属性
        req.setAttribute("message", "Hello");
        String message = (String) req.getAttribute("message");
        
        // 4. 转发请求
        req.getRequestDispatcher("/welcome.jsp").forward(req, resp);
    }
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        // 1. 设置请求编码
        req.setCharacterEncoding("UTF-8");
        
        // 2. 获取表单数据
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        
        // 3. 重定向
        resp.sendRedirect("/login.jsp");
    }
}
```

### 3. 响应处理
```java
public class ResponseServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        // 1. 设置响应类型
        resp.setContentType("text/html;charset=UTF-8");
        
        // 2. 设置响应头
        resp.setHeader("Cache-Control", "no-cache");
        
        // 3. 写入响应内容
        PrintWriter out = resp.getWriter();
        out.println("<html><body>");
        out.println("<h1>Hello World</h1>");
        out.println("</body></html>");
        
        // 4. 发送错误
        resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Page not found");
    }
}
```

## JSP 基础

### 1. JSP 指令
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="header.jsp" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
```

### 2. JSP 动作
```jsp
<jsp:include page="footer.jsp" />
<jsp:forward page="welcome.jsp" />
<jsp:useBean id="user" class="com.example.User" scope="session" />
<jsp:setProperty name="user" property="name" value="John" />
<jsp:getProperty name="user" property="name" />
```

### 3. JSP 内置对象
```jsp
<%
    // 1. request 对象
    String name = request.getParameter("name");
    
    // 2. response 对象
    response.setContentType("text/html");
    
    // 3. session 对象
    session.setAttribute("user", user);
    
    // 4. application 对象
    application.setAttribute("count", 1);
    
    // 5. out 对象
    out.println("Hello World");
    
    // 6. pageContext 对象
    pageContext.setAttribute("message", "Hello");
    
    // 7. config 对象
    String servletName = config.getServletName();
    
    // 8. page 对象
    page.getClass().getName();
%>
```

## Filter 和 Listener

### 1. Filter
```java
public class LogFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初始化
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
            FilterChain chain) throws IOException, ServletException {
        // 请求处理前
        HttpServletRequest req = (HttpServletRequest) request;
        System.out.println("Request URI: " + req.getRequestURI());
        
        // 调用下一个过滤器或目标资源
        chain.doFilter(request, response);
        
        // 响应处理
        System.out.println("Response completed");
    }
    
    @Override
    public void destroy() {
        // 销毁
    }
}
```

### 2. Listener
```java
public class SessionListener implements HttpSessionListener {
    @Override
    public void sessionCreated(HttpSessionEvent se) {
        // 会话创建时调用
        HttpSession session = se.getSession();
        System.out.println("Session created: " + session.getId());
    }
    
    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        // 会话销毁时调用
        HttpSession session = se.getSession();
        System.out.println("Session destroyed: " + session.getId());
    }
}
```

## Cookie 和 Session

### 1. Cookie
```java
public class CookieServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        // 1. 创建 Cookie
        Cookie cookie = new Cookie("username", "John");
        cookie.setMaxAge(3600); // 1小时
        cookie.setPath("/");
        
        // 2. 添加 Cookie
        resp.addCookie(cookie);
        
        // 3. 获取 Cookie
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if ("username".equals(c.getName())) {
                    String username = c.getValue();
                }
            }
        }
    }
}
```

### 2. Session
```java
public class SessionServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        // 1. 获取 Session
        HttpSession session = req.getSession();
        
        // 2. 设置 Session 属性
        session.setAttribute("user", new User("John", 25));
        
        // 3. 获取 Session 属性
        User user = (User) session.getAttribute("user");
        
        // 4. 移除 Session 属性
        session.removeAttribute("user");
        
        // 5. 使 Session 失效
        session.invalidate();
    }
}
```

## 练习

1. Servlet 实践：
   - 实现一个简单的登录功能
   - 实现文件上传功能
   - 实现 RESTful API

2. JSP 实践：
   - 实现用户注册页面
   - 实现商品列表页面
   - 实现购物车功能

3. Filter 和 Listener 实践：
   - 实现请求日志记录
   - 实现用户认证
   - 实现在线用户统计

4. Cookie 和 Session 实践：
   - 实现记住密码功能
   - 实现购物车持久化
   - 实现用户会话管理

::: tip
Web 开发需要注意安全性、性能优化、用户体验等问题，建议多实践和测试。
:::

::: info 扩展阅读
- [Servlet 官方文档](https://docs.oracle.com/javaee/7/api/javax/servlet/Servlet.html)
- [JSP 官方文档](https://docs.oracle.com/javaee/7/api/javax/servlet/jsp/package-summary.html)
::: 