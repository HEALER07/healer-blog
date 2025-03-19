---
title: Spring Security
icon: java
category:
  - Java 核心
tag:
  - Java
  - Spring
  - 安全
date: 2024-03-19
---

# Spring Security

## 基础配置

### 1. 安全配置
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // 1. 授权配置
            .authorizeRequests()
                .antMatchers("/", "/home", "/public/**").permitAll()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/user/**").hasRole("USER")
                .anyRequest().authenticated()
            .and()
            
            // 2. 登录配置
            .formLogin()
                .loginPage("/login")
                .permitAll()
            .and()
            
            // 3. 登出配置
            .logout()
                .logoutSuccessUrl("/")
                .permitAll()
            .and()
            
            // 4. 记住我配置
            .rememberMe()
                .tokenValiditySeconds(86400)
            .and()
            
            // 5. 异常处理
            .exceptionHandling()
                .accessDeniedPage("/403");
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // 1. 内存认证
        auth.inMemoryAuthentication()
            .withUser("user").password(passwordEncoder().encode("password")).roles("USER")
            .and()
            .withUser("admin").password(passwordEncoder().encode("admin")).roles("ADMIN");
            
        // 2. 数据库认证
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(passwordEncoder());
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 2. 用户认证
```java
public class UserAuthentication {
    // 1. 用户实体
    @Entity
    @Table(name = "users")
    public class User implements UserDetails {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        
        private String username;
        private String password;
        private boolean enabled;
        
        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(name = "user_roles")
        private Set<Role> roles = new HashSet<>();
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
        }
        
        // 其他 UserDetails 接口方法实现
    }
    
    // 2. 用户服务
    @Service
    public class UserDetailsServiceImpl implements UserDetailsService {
        @Autowired
        private UserRepository userRepository;
        
        @Override
        public UserDetails loadUserByUsername(String username) 
                throws UsernameNotFoundException {
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            return user;
        }
    }
}
```

### 3. 权限控制
```java
public class PermissionControl {
    // 1. 方法级安全
    @Service
    public class UserService {
        @PreAuthorize("hasRole('ADMIN')")
        public void deleteUser(Long id) {
            // 删除用户
        }
        
        @PreAuthorize("hasRole('ADMIN') or #username == authentication.name")
        public User getUser(String username) {
            // 获取用户
        }
    }
    
    // 2. 注解式安全
    @Controller
    public class UserController {
        @Secured("ROLE_ADMIN")
        @GetMapping("/admin")
        public String adminPage() {
            return "admin";
        }
        
        @RolesAllowed("ROLE_USER")
        @GetMapping("/user")
        public String userPage() {
            return "user";
        }
    }
}
```

## 高级特性

### 1. OAuth2 认证
```java
@Configuration
@EnableAuthorizationServer
public class OAuth2Config extends AuthorizationServerConfigurerAdapter {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()
            .withClient("client")
            .secret(passwordEncoder().encode("secret"))
            .authorizedGrantTypes("password", "refresh_token")
            .scopes("read", "write")
            .accessTokenValiditySeconds(3600)
            .refreshTokenValiditySeconds(86400);
    }
    
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        endpoints
            .authenticationManager(authenticationManager)
            .userDetailsService(userDetailsService);
    }
}
```

### 2. JWT 认证
```java
public class JWTExample {
    // 1. JWT 配置
    @Configuration
    public class JwtConfig {
        @Value("${jwt.secret}")
        private String secret;
        
        @Value("${jwt.expiration}")
        private Long expiration;
        
        @Bean
        public JwtTokenUtil jwtTokenUtil() {
            return new JwtTokenUtil(secret, expiration);
        }
    }
    
    // 2. JWT 过滤器
    public class JwtAuthenticationFilter extends OncePerRequestFilter {
        @Autowired
        private JwtTokenUtil jwtTokenUtil;
        
        @Override
        protected void doFilterInternal(HttpServletRequest request,
                HttpServletResponse response, FilterChain chain)
                throws ServletException, IOException {
            String token = getTokenFromRequest(request);
            
            if (token != null && jwtTokenUtil.validateToken(token)) {
                String username = jwtTokenUtil.getUsernameFromToken(token);
                UserDetails userDetails = userDetailsService
                    .loadUserByUsername(username);
                    
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                        
                SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
            }
            
            chain.doFilter(request, response);
        }
    }
}
```

### 3. 自定义认证
```java
public class CustomAuthentication {
    // 1. 自定义认证提供者
    @Component
    public class CustomAuthenticationProvider implements AuthenticationProvider {
        @Autowired
        private UserDetailsService userDetailsService;
        
        @Override
        public Authentication authenticate(Authentication authentication)
                throws AuthenticationException {
            String username = authentication.getName();
            String password = authentication.getCredentials().toString();
            
            UserDetails userDetails = userDetailsService
                .loadUserByUsername(username);
                
            if (passwordEncoder().matches(password, userDetails.getPassword())) {
                return new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            }
            
            throw new BadCredentialsException("Invalid password");
        }
        
        @Override
        public boolean supports(Class<?> authentication) {
            return authentication.equals(UsernamePasswordAuthenticationToken.class);
        }
    }
    
    // 2. 自定义认证过滤器
    public class CustomAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
        public CustomAuthenticationFilter(String defaultFilterProcessesUrl) {
            super(defaultFilterProcessesUrl);
        }
        
        @Override
        public Authentication attemptAuthentication(HttpServletRequest request,
                HttpServletResponse response) throws AuthenticationException {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            
            UsernamePasswordAuthenticationToken token = 
                new UsernamePasswordAuthenticationToken(username, password);
                
            return this.getAuthenticationManager().authenticate(token);
        }
    }
}
```

## 练习

1. 基础安全实践：
   - 实现用户认证
   - 实现角色授权
   - 实现记住我功能

2. OAuth2 实践：
   - 实现 OAuth2 服务器
   - 实现 OAuth2 客户端
   - 实现第三方登录

3. JWT 实践：
   - 实现 JWT 认证
   - 实现令牌刷新
   - 实现单点登录

4. 综合实践：
   - 实现完整的认证系统
   - 实现权限管理系统
   - 实现安全审计系统

::: tip
安全配置需要根据实际需求进行定制，建议遵循最小权限原则。
:::

::: info 扩展阅读
- [Spring Security 官方文档](https://docs.spring.io/spring-security/reference/index.html)
- [OAuth2 规范](https://oauth.net/2/)
- [JWT 规范](https://jwt.io/)
::: 