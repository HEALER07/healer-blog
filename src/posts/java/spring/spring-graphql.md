---
title: Spring GraphQL
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - GraphQL
date: 2024-03-19
---

# Spring GraphQL

## 基础配置

### 1. GraphQL 配置
```java
@Configuration
public class GraphQLConfig {
    
    @Bean
    public GraphQlSourceBuilderCustomizer sourceBuilderCustomizer() {
        return (builder) ->
            builder.configureGraphQl(graphQlBuilder ->
                graphQlBuilder.introspection(true)
                    .queryExecutionStrategy(new AsyncExecutionStrategy())
                    .mutationExecutionStrategy(new AsyncExecutionStrategy())
                    .subscriptionExecutionStrategy(new AsyncExecutionStrategy())
            );
    }
    
    @Bean
    public GraphQlSource graphQlSource() {
        return GraphQlSource.builder()
            .schemaResources("classpath:graphql/schema.graphqls")
            .configureRuntimeWiring(this::configureRuntimeWiring)
            .build();
    }
    
    private void configureRuntimeWiring(RuntimeWiring.Builder builder) {
        builder.type("Query", typeWiring -> typeWiring
            .dataFetcher("bookById", this::getBookById)
            .dataFetcher("books", this::getBooks));
            
        builder.type("Book", typeWiring -> typeWiring
            .dataFetcher("author", this::getAuthor));
    }
}
```

### 2. Schema 定义
```graphql
type Book {
    id: ID!
    name: String!
    pageCount: Int
    author: Author
}

type Author {
    id: ID!
    firstName: String
    lastName: String
    books: [Book]
}

type Query {
    bookById(id: ID!): Book
    books: [Book]
    authorById(id: ID!): Author
    authors: [Author]
}

type Mutation {
    addBook(name: String!, pageCount: Int, authorId: ID!): Book
    updateBook(id: ID!, name: String, pageCount: Int): Book
    deleteBook(id: ID!): Boolean
}

type Subscription {
    bookAdded: Book
    bookUpdated: Book
    bookDeleted: ID
}
```

### 3. 异常处理
```java
@Configuration
public class GraphQLExceptionConfig {
    
    @Bean
    public GraphQlSourceBuilderCustomizer exceptionHandlerCustomizer() {
        return (builder) ->
            builder.configureGraphQl(graphQlBuilder ->
                graphQlBuilder.introspection(true)
                    .exceptionHandler(new GraphQlExceptionHandler() {
                        @Override
                        public GraphQlError handleException(Throwable ex) {
                            if (ex instanceof BookNotFoundException) {
                                return GraphQlError.newError()
                                    .errorType(ErrorType.NOT_FOUND)
                                    .message(ex.getMessage())
                                    .build();
                            }
                            return GraphQlError.newError()
                                .errorType(ErrorType.INTERNAL_ERROR)
                                .message("Internal server error")
                                .build();
                        }
                    })
            );
    }
}
```

## 查询实现

### 1. 查询解析器
```java
@Component
public class BookQueryResolver implements GraphQlQueryResolver {
    
    @Autowired
    private BookService bookService;
    
    public Book bookById(String id) {
        return bookService.findById(id)
            .orElseThrow(() -> new BookNotFoundException(id));
    }
    
    public List<Book> books() {
        return bookService.findAll();
    }
}
```

### 2. 字段解析器
```java
@Component
public class BookFieldResolver implements GraphQlFieldResolver {
    
    @Autowired
    private AuthorService authorService;
    
    public Author author(Book book) {
        return authorService.findById(book.getAuthorId())
            .orElseThrow(() -> new AuthorNotFoundException(book.getAuthorId()));
    }
}
```

### 3. 数据加载器
```java
@Component
public class AuthorDataLoader implements BatchLoader<String, Author> {
    
    @Autowired
    private AuthorService authorService;
    
    @Override
    public CompletionStage<List<Author>> load(List<String> authorIds) {
        return CompletableFuture.supplyAsync(() ->
            authorService.findAllById(authorIds));
    }
}
```

## 变更实现

### 1. 变更解析器
```java
@Component
public class BookMutationResolver implements GraphQlMutationResolver {
    
    @Autowired
    private BookService bookService;
    
    public Book addBook(String name, Integer pageCount, String authorId) {
        Book book = new Book();
        book.setName(name);
        book.setPageCount(pageCount);
        book.setAuthorId(authorId);
        return bookService.save(book);
    }
    
    public Book updateBook(String id, String name, Integer pageCount) {
        Book book = bookService.findById(id)
            .orElseThrow(() -> new BookNotFoundException(id));
        book.setName(name);
        book.setPageCount(pageCount);
        return bookService.save(book);
    }
    
    public Boolean deleteBook(String id) {
        return bookService.deleteById(id);
    }
}
```

### 2. 输入类型
```java
@Data
public class BookInput {
    private String name;
    private Integer pageCount;
    private String authorId;
}
```

### 3. 验证器
```java
@Component
public class BookValidator {
    
    public void validate(BookInput input) {
        if (input.getName() == null || input.getName().trim().isEmpty()) {
            throw new ValidationException("Book name cannot be empty");
        }
        if (input.getPageCount() != null && input.getPageCount() < 0) {
            throw new ValidationException("Page count cannot be negative");
        }
        if (input.getAuthorId() == null || input.getAuthorId().trim().isEmpty()) {
            throw new ValidationException("Author ID cannot be empty");
        }
    }
}
```

## 订阅实现

### 1. 订阅解析器
```java
@Component
public class BookSubscriptionResolver implements GraphQlSubscriptionResolver {
    
    @Autowired
    private BookPublisher bookPublisher;
    
    public Publisher<Book> bookAdded() {
        return bookPublisher.getBookAddedPublisher();
    }
    
    public Publisher<Book> bookUpdated() {
        return bookPublisher.getBookUpdatedPublisher();
    }
    
    public Publisher<String> bookDeleted() {
        return bookPublisher.getBookDeletedPublisher();
    }
}
```

### 2. 发布者
```java
@Component
public class BookPublisher {
    
    private final Sinks.Many<Book> bookAddedSink = Sinks.many().multicast().onBackpressureBuffer();
    private final Sinks.Many<Book> bookUpdatedSink = Sinks.many().multicast().onBackpressureBuffer();
    private final Sinks.Many<String> bookDeletedSink = Sinks.many().multicast().onBackpressureBuffer();
    
    public Flux<Book> getBookAddedPublisher() {
        return bookAddedSink.asFlux();
    }
    
    public Flux<Book> getBookUpdatedPublisher() {
        return bookUpdatedSink.asFlux();
    }
    
    public Flux<String> getBookDeletedPublisher() {
        return bookDeletedSink.asFlux();
    }
    
    public void publishBookAdded(Book book) {
        bookAddedSink.tryEmitNext(book);
    }
    
    public void publishBookUpdated(Book book) {
        bookUpdatedSink.tryEmitNext(book);
    }
    
    public void publishBookDeleted(String id) {
        bookDeletedSink.tryEmitNext(id);
    }
}
```

## 练习

1. 基础 GraphQL 实践：
   - 实现 Schema 定义
   - 实现查询解析器
   - 实现字段解析器

2. 变更实践：
   - 实现变更解析器
   - 实现输入验证
   - 实现错误处理

3. 订阅实践：
   - 实现订阅解析器
   - 实现发布者
   - 实现实时更新

4. 性能实践：
   - 实现数据加载器
   - 实现缓存
   - 实现分页

::: tip
GraphQL 提供了灵活的数据查询和变更能力，但需要注意查询复杂度和性能问题。
:::

::: info 扩展阅读
- [Spring GraphQL 官方文档](https://docs.spring.io/spring-graphql/docs/current/reference/html/)
- [GraphQL 官方文档](https://graphql.org/learn/)
- [Spring GraphQL 示例](https://github.com/spring-projects/spring-graphql/tree/main/samples)
::: 