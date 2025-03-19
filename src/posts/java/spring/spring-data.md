---
title: Spring Data
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 数据访问
date: 2024-03-19
---

# Spring Data

## JPA 数据访问

### 1. 实体类定义
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String email;
    
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;
    
    // Getters and Setters
}
```

### 2. Repository 接口
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 1. 方法名查询
    List<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    // 2. @Query 注解查询
    @Query("SELECT u FROM User u WHERE u.username LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);
    
    // 3. 原生 SQL 查询
    @Query(value = "SELECT * FROM users WHERE age > :age", nativeQuery = true)
    List<User> findUsersOlderThan(@Param("age") int age);
}
```

### 3. 服务层实现
```java
@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(User user) {
        user.setCreatedAt(new Date());
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
            
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        
        return userRepository.save(existingUser);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
```

## MongoDB 数据访问

### 1. 文档类定义
```java
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    
    @Field("name")
    private String name;
    
    @Field("price")
    private BigDecimal price;
    
    @Field("categories")
    private List<String> categories;
    
    @Field("created_at")
    private Date createdAt;
    
    // Getters and Setters
}
```

### 2. Repository 接口
```java
@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // 1. 方法名查询
    List<Product> findByPriceLessThan(BigDecimal price);
    Optional<Product> findByName(String name);
    
    // 2. @Query 注解查询
    @Query("{ 'price': { $gt: ?0, $lt: ?1 } }")
    List<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    
    // 3. 聚合查询
    @Aggregation(pipeline = {
        "{ $match: { categories: ?0 } }",
        "{ $group: { _id: null, avgPrice: { $avg: '$price' } } }"
    })
    AggregationResults<PriceStats> getAveragePriceByCategory(String category);
}
```

### 3. 服务层实现
```java
@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    
    public Product createProduct(Product product) {
        product.setCreatedAt(new Date());
        return productRepository.save(product);
    }
    
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
```

## Redis 数据访问

### 1. 实体类定义
```java
@RedisHash("carts")
public class Cart {
    @Id
    private String id;
    
    private String userId;
    private Map<String, Integer> items;
    private Date lastUpdated;
    
    // Getters and Setters
}
```

### 2. Repository 接口
```java
@Repository
public interface CartRepository extends CrudRepository<Cart, String> {
    // 1. 方法名查询
    Optional<Cart> findByUserId(String userId);
    
    // 2. 自定义查询
    @Query("SELECT * FROM carts WHERE lastUpdated < ?0")
    List<Cart> findExpiredCarts(Date date);
}
```

### 3. 服务层实现
```java
@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    
    public Cart addItem(String userId, String productId, int quantity) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElse(new Cart(userId));
            
        cart.getItems().merge(productId, quantity, Integer::sum);
        cart.setLastUpdated(new Date());
        
        return cartRepository.save(cart);
    }
    
    public void removeItem(String userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new EntityNotFoundException("Cart not found"));
            
        cart.getItems().remove(productId);
        cart.setLastUpdated(new Date());
        
        cartRepository.save(cart);
    }
}
```

## Elasticsearch 数据访问

### 1. 文档类定义
```java
@Document(indexName = "articles")
public class Article {
    @Id
    private String id;
    
    @Field(type = FieldType.Text)
    private String title;
    
    @Field(type = FieldType.Text)
    private String content;
    
    @Field(type = FieldType.Keyword)
    private List<String> tags;
    
    @Field(type = FieldType.Date)
    private Date publishDate;
    
    // Getters and Setters
}
```

### 2. Repository 接口
```java
@Repository
public interface ArticleRepository extends ElasticsearchRepository<Article, String> {
    // 1. 方法名查询
    List<Article> findByTagsContaining(String tag);
    
    // 2. 自定义查询
    @Query("{" +
        "\"bool\": {" +
            "\"must\": [" +
                "{\"match\": {\"title\": \"?0\"}}," +
                "{\"match\": {\"content\": \"?1\"}}" +
            "]" +
        "}" +
    "}")
    List<Article> searchArticles(String title, String content);
}
```

### 3. 服务层实现
```java
@Service
public class ArticleService {
    @Autowired
    private ArticleRepository articleRepository;
    
    public Article createArticle(Article article) {
        article.setPublishDate(new Date());
        return articleRepository.save(article);
    }
    
    public List<Article> searchArticles(String keyword) {
        return articleRepository.findByTitleContainingOrContentContaining(
            keyword, keyword);
    }
    
    public void deleteArticle(String id) {
        articleRepository.deleteById(id);
    }
}
```

## 练习

1. JPA 实践：
   - 实现实体类映射
   - 实现 Repository 接口
   - 实现事务管理

2. MongoDB 实践：
   - 实现文档类映射
   - 实现聚合查询
   - 实现索引管理

3. Redis 实践：
   - 实现缓存管理
   - 实现分布式锁
   - 实现会话管理

4. Elasticsearch 实践：
   - 实现全文搜索
   - 实现聚合分析
   - 实现索引管理

::: tip
数据访问层需要考虑性能、安全性和可维护性，建议根据实际需求选择合适的数据库和访问方式。
:::

::: info 扩展阅读
- [Spring Data 官方文档](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [MongoDB 官方文档](https://www.mongodb.com/docs/manual/)
- [Redis 官方文档](https://redis.io/documentation)
- [Elasticsearch 官方文档](https://www.elastic.co/guide/index.html)
::: 