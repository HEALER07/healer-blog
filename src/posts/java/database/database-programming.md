---
title: Java 数据库编程
icon: java
category:
  - Java 核心
tag:
  - Java
  - 数据库
  - JDBC
date: 2021-03-19
---

# Java 数据库编程

## JDBC 基础

### 1. JDBC 连接
```java
public class JDBCConnection {
    // 1. 加载驱动
    public void loadDriver() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
    
    // 2. 建立连接
    public Connection getConnection() throws SQLException {
        String url = "jdbc:mysql://localhost:3306/test";
        String username = "root";
        String password = "password";
        
        return DriverManager.getConnection(url, username, password);
    }
    
    // 3. 关闭连接
    public void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
```

### 2. 基本操作
```java
public class JDBCOperations {
    // 1. 查询操作
    public void query(Connection conn) throws SQLException {
        String sql = "SELECT * FROM users WHERE id = ?";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, 1);
        
        ResultSet rs = pstmt.executeQuery();
        while (rs.next()) {
            System.out.println(rs.getString("name"));
        }
        
        rs.close();
        pstmt.close();
    }
    
    // 2. 插入操作
    public void insert(Connection conn) throws SQLException {
        String sql = "INSERT INTO users (name, age) VALUES (?, ?)";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, "John");
        pstmt.setInt(2, 25);
        
        pstmt.executeUpdate();
        pstmt.close();
    }
    
    // 3. 更新操作
    public void update(Connection conn) throws SQLException {
        String sql = "UPDATE users SET age = ? WHERE name = ?";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, 26);
        pstmt.setString(2, "John");
        
        pstmt.executeUpdate();
        pstmt.close();
    }
    
    // 4. 删除操作
    public void delete(Connection conn) throws SQLException {
        String sql = "DELETE FROM users WHERE id = ?";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, 1);
        
        pstmt.executeUpdate();
        pstmt.close();
    }
}
```

## 数据库连接池

### 1. DBCP
```java
public class DBCPExample {
    private BasicDataSource dataSource;
    
    public void initDataSource() {
        dataSource = new BasicDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/test");
        dataSource.setUsername("root");
        dataSource.setPassword("password");
        
        // 连接池配置
        dataSource.setInitialSize(5);
        dataSource.setMaxActive(10);
        dataSource.setMaxIdle(5);
        dataSource.setMinIdle(2);
    }
    
    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
```

### 2. C3P0
```java
public class C3P0Example {
    private ComboPooledDataSource dataSource;
    
    public void initDataSource() {
        dataSource = new ComboPooledDataSource();
        try {
            dataSource.setDriverClass("com.mysql.cj.jdbc.Driver");
            dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/test");
            dataSource.setUser("root");
            dataSource.setPassword("password");
            
            // 连接池配置
            dataSource.setInitialPoolSize(5);
            dataSource.setMaxPoolSize(10);
            dataSource.setMinPoolSize(2);
        } catch (PropertyVetoException e) {
            e.printStackTrace();
        }
    }
    
    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
```

### 3. Druid
```java
public class DruidExample {
    private DruidDataSource dataSource;
    
    public void initDataSource() {
        dataSource = new DruidDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/test");
        dataSource.setUsername("root");
        dataSource.setPassword("password");
        
        // 连接池配置
        dataSource.setInitialSize(5);
        dataSource.setMaxActive(10);
        dataSource.setMinIdle(2);
        dataSource.setMaxWait(60000);
    }
    
    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
```

## MyBatis

### 1. 基本配置
```java
public class MyBatisConfig {
    // 1. 配置文件
    public SqlSessionFactory getSqlSessionFactory() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        return new SqlSessionFactoryBuilder().build(inputStream);
    }
    
    // 2. 映射文件
    public class UserMapper {
        public interface UserMapper {
            @Select("SELECT * FROM users WHERE id = #{id}")
            User getUserById(int id);
            
            @Insert("INSERT INTO users (name, age) VALUES (#{name}, #{age})")
            void insertUser(User user);
            
            @Update("UPDATE users SET age = #{age} WHERE name = #{name}")
            void updateUser(User user);
            
            @Delete("DELETE FROM users WHERE id = #{id}")
            void deleteUser(int id);
        }
    }
}
```

### 2. 使用示例
```java
public class MyBatisExample {
    private SqlSessionFactory sqlSessionFactory;
    
    public void init() throws IOException {
        sqlSessionFactory = new MyBatisConfig().getSqlSessionFactory();
    }
    
    public void example() {
        try (SqlSession session = sqlSessionFactory.openSession()) {
            UserMapper mapper = session.getMapper(UserMapper.class);
            
            // 查询
            User user = mapper.getUserById(1);
            
            // 插入
            User newUser = new User("John", 25);
            mapper.insertUser(newUser);
            
            // 更新
            user.setAge(26);
            mapper.updateUser(user);
            
            // 删除
            mapper.deleteUser(1);
            
            session.commit();
        }
    }
}
```

## JPA

### 1. 实体类
```java
public class JPAEntity {
    @Entity
    @Table(name = "users")
    public class User {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        
        @Column(name = "name")
        private String name;
        
        @Column(name = "age")
        private Integer age;
        
        // getters and setters
    }
}
```

### 2. 数据访问
```java
public class JPADao {
    @PersistenceContext
    private EntityManager entityManager;
    
    // 1. 查询
    public User findById(Long id) {
        return entityManager.find(User.class, id);
    }
    
    // 2. 插入
    public void save(User user) {
        entityManager.persist(user);
    }
    
    // 3. 更新
    public void update(User user) {
        entityManager.merge(user);
    }
    
    // 4. 删除
    public void delete(Long id) {
        User user = findById(id);
        if (user != null) {
            entityManager.remove(user);
        }
    }
}
```

## 练习

1. JDBC 实践：
   - 实现一个简单的 CRUD 操作
   - 实现事务管理
   - 实现批量操作

2. 连接池实践：
   - 配置和使用连接池
   - 实现连接池监控
   - 优化连接池性能

3. MyBatis 实践：
   - 实现动态 SQL
   - 实现关联查询
   - 实现缓存机制

4. JPA 实践：
   - 实现实体关系映射
   - 实现 JPQL 查询
   - 实现事务管理

::: tip
数据库编程需要注意连接管理、事务处理、性能优化等问题，建议多实践和测试。
:::

::: info 扩展阅读
- [MyBatis 官方文档](https://mybatis.org/mybatis-3/)
- [JPA 官方文档](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
:::