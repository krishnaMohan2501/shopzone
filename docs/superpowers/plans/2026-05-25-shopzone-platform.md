# ShopZone — Online Shopping Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack e-commerce platform with Java/Spring Boot backend, React frontend, PostgreSQL database, packaged as a single executable JAR for CD submission.

**Architecture:** Spring Boot REST API with JWT auth serves all `/api/**` routes; the React+Vite frontend is built by Maven and copied into `src/main/resources/static` so one fat JAR serves everything. PostgreSQL is the only external dependency.

**Tech Stack:** Java 17, Spring Boot 3.2, Spring Security 6, Spring Data JPA, PostgreSQL 15, jjwt 0.12, Lombok, React 18, Vite 5, Tailwind CSS 3, Axios, React Router 6, frontend-maven-plugin 1.15

---

## File Map

```
shopzone/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/shopzone/
│       │   │   ├── ShopZoneApplication.java
│       │   │   ├── config/
│       │   │   │   ├── SecurityConfig.java
│       │   │   │   └── DataInitializer.java
│       │   │   ├── security/
│       │   │   │   ├── JwtUtil.java
│       │   │   │   └── JwtAuthFilter.java
│       │   │   ├── model/
│       │   │   │   ├── User.java
│       │   │   │   ├── Category.java
│       │   │   │   ├── Product.java
│       │   │   │   ├── Cart.java
│       │   │   │   ├── CartItem.java
│       │   │   │   ├── Order.java
│       │   │   │   └── OrderItem.java
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java
│       │   │   │   ├── CategoryRepository.java
│       │   │   │   ├── ProductRepository.java
│       │   │   │   ├── CartRepository.java
│       │   │   │   ├── CartItemRepository.java
│       │   │   │   ├── OrderRepository.java
│       │   │   │   └── OrderItemRepository.java
│       │   │   ├── dto/
│       │   │   │   ├── RegisterRequest.java
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── AuthResponse.java
│       │   │   │   ├── ProductRequest.java
│       │   │   │   ├── CartItemRequest.java
│       │   │   │   └── OrderRequest.java
│       │   │   ├── service/
│       │   │   │   ├── UserDetailsServiceImpl.java
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── ProductService.java
│       │   │   │   ├── CategoryService.java
│       │   │   │   ├── CartService.java
│       │   │   │   └── OrderService.java
│       │   │   └── controller/
│       │   │       ├── AuthController.java
│       │   │       ├── ProductController.java
│       │   │       ├── CategoryController.java
│       │   │       ├── CartController.java
│       │   │       └── OrderController.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/java/com/shopzone/
│           └── ShopZoneApplicationTests.java
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/axios.js
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx
│       │   └── ProtectedRoute.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Products.jsx
│           ├── ProductDetail.jsx
│           ├── Cart.jsx
│           ├── Checkout.jsx
│           ├── Orders.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           └── admin/
│               ├── AdminDashboard.jsx
│               ├── AdminProducts.jsx
│               └── AdminOrders.jsx
├── scripts/
│   ├── setup.sql
│   ├── run.bat
│   └── run.sh
├── .gitignore
└── README.md
```

---

### Task 1: Maven Project Setup (pom.xml)

**Files:**
- Create: `backend/pom.xml`

- [ ] **Step 1: Create backend/pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
    </parent>
    <groupId>com.shopzone</groupId>
    <artifactId>shopzone</artifactId>
    <version>1.0.0</version>
    <name>ShopZone</name>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.5</jjwt.version>
        <node.version>v20.11.0</node.version>
        <npm.version>10.2.4</npm.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            <plugin>
                <groupId>com.github.eirslett</groupId>
                <artifactId>frontend-maven-plugin</artifactId>
                <version>1.15.0</version>
                <configuration>
                    <workingDirectory>../frontend</workingDirectory>
                    <installDirectory>target</installDirectory>
                    <nodeVersion>${node.version}</nodeVersion>
                    <npmVersion>${npm.version}</npmVersion>
                </configuration>
                <executions>
                    <execution>
                        <id>install node and npm</id>
                        <goals><goal>install-node-and-npm</goal></goals>
                    </execution>
                    <execution>
                        <id>npm install</id>
                        <goals><goal>npm</goal></goals>
                        <configuration><arguments>install</arguments></configuration>
                    </execution>
                    <execution>
                        <id>npm build</id>
                        <goals><goal>npm</goal></goals>
                        <configuration><arguments>run build</arguments></configuration>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <executions>
                    <execution>
                        <id>copy-frontend-build</id>
                        <phase>generate-resources</phase>
                        <goals><goal>copy-resources</goal></goals>
                        <configuration>
                            <outputDirectory>${project.build.outputDirectory}/static</outputDirectory>
                            <resources>
                                <resource>
                                    <directory>../frontend/dist</directory>
                                    <filtering>false</filtering>
                                </resource>
                            </resources>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: Create application entry point**

Create `backend/src/main/java/com/shopzone/ShopZoneApplication.java`:

```java
package com.shopzone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ShopZoneApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopZoneApplication.class, args);
    }
}
```

- [ ] **Step 3: Create application.properties**

Create `backend/src/main/resources/application.properties`:

```properties
spring.application.name=shopzone
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/shopzone
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

jwt.secret=shopzone-secret-key-2024-very-long-and-secure-string-for-jwt-signing
jwt.expiration=86400000

spring.web.resources.static-locations=classpath:/static/
spring.mvc.throw-exception-if-no-handler-found=true
spring.web.resources.add-mappings=true
```

- [ ] **Step 4: Commit**

```bash
cd /Users/krishna/shopzone
git init
git add backend/
git commit -m "feat: initial Spring Boot project setup with pom.xml"
```

---

### Task 2: Database Setup Script

**Files:**
- Create: `scripts/setup.sql`

- [ ] **Step 1: Create PostgreSQL setup script**

Create `scripts/setup.sql`:

```sql
-- Run this once to create the database
-- psql -U postgres -f setup.sql

CREATE DATABASE shopzone;
\c shopzone;

-- Tables are auto-created by Hibernate on first run (spring.jpa.hibernate.ddl-auto=update)
-- This script just ensures the DB exists.

-- Optional: create a dedicated user
-- CREATE USER shopzone_user WITH PASSWORD 'shopzone_pass';
-- GRANT ALL PRIVILEGES ON DATABASE shopzone TO shopzone_user;
```

- [ ] **Step 2: Commit**

```bash
git add scripts/setup.sql
git commit -m "feat: add PostgreSQL setup script"
```

---

### Task 3: Domain Models

**Files:**
- Create: `backend/src/main/java/com/shopzone/model/User.java`
- Create: `backend/src/main/java/com/shopzone/model/Category.java`
- Create: `backend/src/main/java/com/shopzone/model/Product.java`
- Create: `backend/src/main/java/com/shopzone/model/Cart.java`
- Create: `backend/src/main/java/com/shopzone/model/CartItem.java`
- Create: `backend/src/main/java/com/shopzone/model/Order.java`
- Create: `backend/src/main/java/com/shopzone/model/OrderItem.java`

- [ ] **Step 1: Create User.java**

```java
package com.shopzone.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CUSTOMER;

    public enum Role { CUSTOMER, ADMIN }
}
```

- [ ] **Step 2: Create Category.java**

```java
package com.shopzone.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
```

- [ ] **Step 3: Create Product.java**

```java
package com.shopzone.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;
}
```

- [ ] **Step 4: Create Cart.java**

```java
package com.shopzone.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Cart {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();
}
```

- [ ] **Step 5: Create CartItem.java**

```java
package com.shopzone.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;
}
```

- [ ] **Step 6: Create Order.java**

```java
package com.shopzone.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String shippingAddress;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    public enum Status { PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }
}
```

- [ ] **Step 7: Create OrderItem.java**

```java
package com.shopzone.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
```

- [ ] **Step 8: Commit**

```bash
git add backend/src/main/java/com/shopzone/model/
git commit -m "feat: add JPA domain models (User, Product, Cart, Order)"
```

---

### Task 4: Repositories

**Files:**
- Create: `backend/src/main/java/com/shopzone/repository/*.java` (7 files)

- [ ] **Step 1: Create all repositories**

`UserRepository.java`:
```java
package com.shopzone.repository;
import com.shopzone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

`CategoryRepository.java`:
```java
package com.shopzone.repository;
import com.shopzone.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {}
```

`ProductRepository.java`:
```java
package com.shopzone.repository;
import com.shopzone.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
}
```

`CartRepository.java`:
```java
package com.shopzone.repository;
import com.shopzone.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(Long userId);
}
```

`CartItemRepository.java`:
```java
package com.shopzone.repository;
import com.shopzone.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {}
```

`OrderRepository.java`:
```java
package com.shopzone.repository;
import com.shopzone.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
```

`OrderItemRepository.java`:
```java
package com.shopzone.repository;
import com.shopzone.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/com/shopzone/repository/
git commit -m "feat: add Spring Data JPA repositories"
```

---

### Task 5: JWT Security

**Files:**
- Create: `backend/src/main/java/com/shopzone/security/JwtUtil.java`
- Create: `backend/src/main/java/com/shopzone/security/JwtAuthFilter.java`
- Create: `backend/src/main/java/com/shopzone/service/UserDetailsServiceImpl.java`
- Create: `backend/src/main/java/com/shopzone/config/SecurityConfig.java`

- [ ] **Step 1: Create JwtUtil.java**

```java
package com.shopzone.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key())
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean isValid(String token) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

- [ ] **Step 2: Create JwtAuthFilter.java**

```java
package com.shopzone.security;

import com.shopzone.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isValid(token)) {
                String email = jwtUtil.extractEmail(token);
                UserDetails user = userDetailsService.loadUserByUsername(email);
                var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(req, res);
    }
}
```

- [ ] **Step 3: Create UserDetailsServiceImpl.java**

```java
package com.shopzone.service;

import com.shopzone.model.User;
import com.shopzone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
```

- [ ] **Step 4: Create SecurityConfig.java**

```java
package com.shopzone.config;

import com.shopzone.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/", "/index.html", "/assets/**", "/*.js", "/*.css", "/*.ico").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/shopzone/security/ \
        backend/src/main/java/com/shopzone/service/UserDetailsServiceImpl.java \
        backend/src/main/java/com/shopzone/config/SecurityConfig.java
git commit -m "feat: add JWT security config and filter"
```

---

### Task 6: DTOs

**Files:**
- Create: `backend/src/main/java/com/shopzone/dto/*.java` (6 files)

- [ ] **Step 1: Create all DTOs**

`RegisterRequest.java`:
```java
package com.shopzone.dto;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String name;
    @Email @NotBlank private String email;
    @NotBlank @Size(min = 6) private String password;
}
```

`LoginRequest.java`:
```java
package com.shopzone.dto;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class LoginRequest {
    @Email @NotBlank private String email;
    @NotBlank private String password;
}
```

`AuthResponse.java`:
```java
package com.shopzone.dto;
import lombok.*;

@Data @AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
}
```

`ProductRequest.java`:
```java
package com.shopzone.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank private String name;
    private String description;
    @NotNull @DecimalMin("0.01") private BigDecimal price;
    @NotNull @Min(0) private Integer stock;
    private String imageUrl;
    private Long categoryId;
}
```

`CartItemRequest.java`:
```java
package com.shopzone.dto;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull private Long productId;
    @NotNull @Min(1) private Integer quantity;
}
```

`OrderRequest.java`:
```java
package com.shopzone.dto;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrderRequest {
    @NotBlank private String shippingAddress;
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/com/shopzone/dto/
git commit -m "feat: add request/response DTOs"
```

---

### Task 7: Auth Service & Controller

**Files:**
- Create: `backend/src/main/java/com/shopzone/service/AuthService.java`
- Create: `backend/src/main/java/com/shopzone/controller/AuthController.java`
- Create: `backend/src/main/java/com/shopzone/config/DataInitializer.java`

- [ ] **Step 1: Create AuthService.java**

```java
package com.shopzone.service;

import com.shopzone.dto.*;
import com.shopzone.model.User;
import com.shopzone.repository.UserRepository;
import com.shopzone.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(User.Role.CUSTOMER)
                .build();
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
```

- [ ] **Step 2: Create AuthController.java**

```java
package com.shopzone.controller;

import com.shopzone.dto.*;
import com.shopzone.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
```

- [ ] **Step 3: Create DataInitializer.java (seeds admin + sample data)**

```java
package com.shopzone.config;

import com.shopzone.model.*;
import com.shopzone.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (userRepo.existsByEmail("admin@shopzone.com")) return;

        userRepo.save(User.builder().name("Admin").email("admin@shopzone.com")
                .password(encoder.encode("admin123")).role(User.Role.ADMIN).build());

        Category electronics = categoryRepo.save(Category.builder().name("Electronics").build());
        Category clothing   = categoryRepo.save(Category.builder().name("Clothing").build());
        Category books      = categoryRepo.save(Category.builder().name("Books").build());

        productRepo.saveAll(List.of(
            Product.builder().name("Wireless Headphones").description("Premium sound, 30hr battery")
                .price(new BigDecimal("2999.00")).stock(50).category(electronics)
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400").build(),
            Product.builder().name("Laptop Stand").description("Adjustable aluminium stand")
                .price(new BigDecimal("1499.00")).stock(100).category(electronics)
                .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400").build(),
            Product.builder().name("Cotton T-Shirt").description("100% cotton, multiple colors")
                .price(new BigDecimal("499.00")).stock(200).category(clothing)
                .imageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400").build(),
            Product.builder().name("Clean Code").description("A handbook of agile software craftsmanship")
                .price(new BigDecimal("799.00")).stock(30).category(books)
                .imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400").build(),
            Product.builder().name("Mechanical Keyboard").description("RGB backlit, tactile switches")
                .price(new BigDecimal("3499.00")).stock(25).category(electronics)
                .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400").build(),
            Product.builder().name("Running Shoes").description("Lightweight, breathable design")
                .price(new BigDecimal("1999.00")).stock(75).category(clothing)
                .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400").build()
        ));
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/java/com/shopzone/service/AuthService.java \
        backend/src/main/java/com/shopzone/controller/AuthController.java \
        backend/src/main/java/com/shopzone/config/DataInitializer.java
git commit -m "feat: auth endpoints (register/login) + seed data"
```

---

### Task 8: Product & Category APIs

**Files:**
- Create: `backend/src/main/java/com/shopzone/service/CategoryService.java`
- Create: `backend/src/main/java/com/shopzone/service/ProductService.java`
- Create: `backend/src/main/java/com/shopzone/controller/CategoryController.java`
- Create: `backend/src/main/java/com/shopzone/controller/ProductController.java`

- [ ] **Step 1: Create CategoryService.java**

```java
package com.shopzone.service;

import com.shopzone.model.Category;
import com.shopzone.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepo;

    public List<Category> findAll() { return categoryRepo.findAll(); }

    public Category create(String name) {
        return categoryRepo.save(Category.builder().name(name).build());
    }
}
```

- [ ] **Step 2: Create ProductService.java**

```java
package com.shopzone.service;

import com.shopzone.dto.ProductRequest;
import com.shopzone.model.Category;
import com.shopzone.model.Product;
import com.shopzone.repository.CategoryRepository;
import com.shopzone.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;

    public Page<Product> search(String name, Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        if (name != null && !name.isBlank() && categoryId != null)
            return productRepo.findByNameContainingIgnoreCaseAndCategoryId(name, categoryId, pageable);
        if (name != null && !name.isBlank())
            return productRepo.findByNameContainingIgnoreCase(name, pageable);
        if (categoryId != null)
            return productRepo.findByCategoryId(categoryId, pageable);
        return productRepo.findAll(pageable);
    }

    public Product findById(Long id) {
        return productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product create(ProductRequest req) {
        Category category = req.getCategoryId() != null
                ? categoryRepo.findById(req.getCategoryId()).orElse(null) : null;
        return productRepo.save(Product.builder()
                .name(req.getName()).description(req.getDescription())
                .price(req.getPrice()).stock(req.getStock())
                .imageUrl(req.getImageUrl()).category(category).build());
    }

    public Product update(Long id, ProductRequest req) {
        Product p = findById(id);
        Category category = req.getCategoryId() != null
                ? categoryRepo.findById(req.getCategoryId()).orElse(null) : null;
        p.setName(req.getName()); p.setDescription(req.getDescription());
        p.setPrice(req.getPrice()); p.setStock(req.getStock());
        p.setImageUrl(req.getImageUrl()); p.setCategory(category);
        return productRepo.save(p);
    }

    public void delete(Long id) { productRepo.deleteById(id); }
}
```

- [ ] **Step 3: Create CategoryController.java**

```java
package com.shopzone.controller;

import com.shopzone.model.Category;
import com.shopzone.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public List<Category> getAll() { return categoryService.findAll(); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> create(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(categoryService.create(body.get("name")));
    }
}
```

- [ ] **Step 4: Create ProductController.java**

```java
package com.shopzone.controller;

import com.shopzone.dto.ProductRequest;
import com.shopzone.model.Product;
import com.shopzone.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public Page<Product> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return productService.search(search, category, page, size);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) { return productService.findById(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(productService.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(productService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

- [ ] **Step 5: Add @EnableMethodSecurity to SecurityConfig**

In `SecurityConfig.java`, add `@EnableMethodSecurity` annotation to the class:
```java
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity  // add this line
public class SecurityConfig {
```

- [ ] **Step 6: Commit**

```bash
git add backend/src/main/java/com/shopzone/service/CategoryService.java \
        backend/src/main/java/com/shopzone/service/ProductService.java \
        backend/src/main/java/com/shopzone/controller/
git commit -m "feat: product and category CRUD APIs"
```

---

### Task 9: Cart & Order APIs

**Files:**
- Create: `backend/src/main/java/com/shopzone/service/CartService.java`
- Create: `backend/src/main/java/com/shopzone/service/OrderService.java`
- Create: `backend/src/main/java/com/shopzone/controller/CartController.java`
- Create: `backend/src/main/java/com/shopzone/controller/OrderController.java`

- [ ] **Step 1: Create CartService.java**

```java
package com.shopzone.service;

import com.shopzone.dto.CartItemRequest;
import com.shopzone.model.*;
import com.shopzone.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    private Cart getOrCreateCart(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return cartRepo.findByUserId(user.getId())
                .orElseGet(() -> cartRepo.save(Cart.builder().user(user).build()));
    }

    public Cart getCart(String email) { return getOrCreateCart(email); }

    @Transactional
    public Cart addItem(String email, CartItemRequest req) {
        Cart cart = getOrCreateCart(email);
        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cart.getItems().stream()
            .filter(i -> i.getProduct().getId().equals(req.getProductId()))
            .findFirst()
            .ifPresentOrElse(
                item -> item.setQuantity(item.getQuantity() + req.getQuantity()),
                () -> cart.getItems().add(CartItem.builder()
                        .cart(cart).product(product).quantity(req.getQuantity()).build())
            );
        return cartRepo.save(cart);
    }

    @Transactional
    public Cart updateItem(String email, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().stream()
            .filter(i -> i.getId().equals(itemId)).findFirst()
            .ifPresent(item -> {
                if (quantity <= 0) cart.getItems().remove(item);
                else item.setQuantity(quantity);
            });
        return cartRepo.save(cart);
    }

    @Transactional
    public Cart removeItem(String email, Long itemId) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return cartRepo.save(cart);
    }

    @Transactional
    public void clearCart(String email) {
        Cart cart = getOrCreateCart(email);
        cart.getItems().clear();
        cartRepo.save(cart);
    }
}
```

- [ ] **Step 2: Create OrderService.java**

```java
package com.shopzone.service;

import com.shopzone.dto.OrderRequest;
import com.shopzone.model.*;
import com.shopzone.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final CartService cartService;

    @Transactional
    public Order placeOrder(String email, OrderRequest req) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Cart cart = cartService.getCart(email);

        if (cart.getItems().isEmpty())
            throw new RuntimeException("Cart is empty");

        BigDecimal total = cart.getItems().stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user).shippingAddress(req.getShippingAddress())
                .totalAmount(total).status(Order.Status.PENDING).build();

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(i -> OrderItem.builder()
                        .order(order).product(i.getProduct())
                        .quantity(i.getQuantity()).price(i.getProduct().getPrice()).build())
                .collect(Collectors.toList());
        order.setItems(orderItems);

        Order saved = orderRepo.save(order);
        cartService.clearCart(email);
        return saved;
    }

    public List<Order> getUserOrders(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return orderRepo.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Order getById(Long id, String email) {
        Order order = orderRepo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getEmail().equals(email))
            throw new RuntimeException("Access denied");
        return order;
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll(org.springframework.data.domain.Sort.by("createdAt").descending());
    }

    public Order updateStatus(Long id, String status) {
        Order order = orderRepo.findById(id).orElseThrow();
        order.setStatus(Order.Status.valueOf(status));
        return orderRepo.save(order);
    }
}
```

- [ ] **Step 3: Create CartController.java**

```java
package com.shopzone.controller;

import com.shopzone.dto.CartItemRequest;
import com.shopzone.model.Cart;
import com.shopzone.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public Cart getCart(@AuthenticationPrincipal UserDetails user) {
        return cartService.getCart(user.getUsername());
    }

    @PostMapping("/items")
    public Cart addItem(@AuthenticationPrincipal UserDetails user,
                        @Valid @RequestBody CartItemRequest req) {
        return cartService.addItem(user.getUsername(), req);
    }

    @PutMapping("/items/{itemId}")
    public Cart updateItem(@AuthenticationPrincipal UserDetails user,
                           @PathVariable Long itemId,
                           @RequestBody Map<String, Integer> body) {
        return cartService.updateItem(user.getUsername(), itemId, body.get("quantity"));
    }

    @DeleteMapping("/items/{itemId}")
    public Cart removeItem(@AuthenticationPrincipal UserDetails user, @PathVariable Long itemId) {
        return cartService.removeItem(user.getUsername(), itemId);
    }
}
```

- [ ] **Step 4: Create OrderController.java**

```java
package com.shopzone.controller;

import com.shopzone.dto.OrderRequest;
import com.shopzone.model.Order;
import com.shopzone.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> place(@AuthenticationPrincipal UserDetails user,
                                       @Valid @RequestBody OrderRequest req) {
        return ResponseEntity.ok(orderService.placeOrder(user.getUsername(), req));
    }

    @GetMapping
    public List<Order> myOrders(@AuthenticationPrincipal UserDetails user) {
        return orderService.getUserOrders(user.getUsername());
    }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        return orderService.getById(id, user.getUsername());
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> allOrders() { return orderService.getAllOrders(); }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Order updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderService.updateStatus(id, body.get("status"));
    }
}
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/main/java/com/shopzone/service/ \
        backend/src/main/java/com/shopzone/controller/CartController.java \
        backend/src/main/java/com/shopzone/controller/OrderController.java
git commit -m "feat: cart and order APIs"
```

---

### Task 10: Basic Backend Smoke Test

- [ ] **Step 1: Create ShopZoneApplicationTests.java**

```java
package com.shopzone;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class ShopZoneApplicationTests {
    @Test
    void contextLoads() {}
}
```

- [ ] **Step 2: Create test application.properties**

Create `backend/src/test/resources/application.properties`:
```properties
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
jwt.secret=test-secret-key-minimum-32-characters-long
jwt.expiration=86400000
```

- [ ] **Step 3: Add H2 test dependency to pom.xml**

In the `<dependencies>` block:
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

- [ ] **Step 4: Run tests (expect PASS)**

```bash
cd backend && mvn test -q
```
Expected: `BUILD SUCCESS`

- [ ] **Step 5: Commit**

```bash
git add backend/src/test/ backend/pom.xml
git commit -m "test: context loads smoke test with H2 in-memory"
```

---

### Task 11: React + Vite + Tailwind Setup

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/vite.config.js`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.jsx`
- Create: `frontend/src/index.css`

- [ ] **Step 1: Create frontend/package.json**

```json
{
  "name": "shopzone-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.8",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.11"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  build: {
    outDir: 'dist'
  }
})
```

- [ ] **Step 3: Create tailwind.config.js**

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#eff6ff', 500:'#3b82f6', 600:'#2563eb', 700:'#1d4ed8' }
      }
    }
  },
  plugins: []
}
```

- [ ] **Step 4: Create postcss.config.js**

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
```

- [ ] **Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ShopZone</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛒</text></svg>" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-gray-50 text-gray-900; }
}
```

- [ ] **Step 7: Create src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 8: Install deps and verify Vite starts**

```bash
cd frontend && npm install
npm run dev
```
Expected: Vite server starts at http://localhost:5173

- [ ] **Step 9: Commit**

```bash
cd ..
git add frontend/
git commit -m "feat: React + Vite + Tailwind CSS frontend scaffold"
```

---

### Task 12: API Client + Auth Context

**Files:**
- Create: `frontend/src/api/axios.js`
- Create: `frontend/src/context/AuthContext.jsx`

- [ ] **Step 1: Create src/api/axios.js**

```js
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
```

- [ ] **Step 2: Create src/context/AuthContext.jsx**

```jsx
import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/api/ frontend/src/context/AuthContext.jsx
git commit -m "feat: axios client with JWT interceptor + auth context"
```

---

### Task 13: Cart Context + Core Components

**Files:**
- Create: `frontend/src/context/CartContext.jsx`
- Create: `frontend/src/components/Navbar.jsx`
- Create: `frontend/src/components/Footer.jsx`
- Create: `frontend/src/components/ProductCard.jsx`
- Create: `frontend/src/components/ProtectedRoute.jsx`
- Create: `frontend/src/App.jsx`

- [ ] **Step 1: Create CartContext.jsx**

```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [] })

  useEffect(() => {
    if (user) api.get('/cart').then(r => setCart(r.data)).catch(() => {})
    else setCart({ items: [] })
  }, [user])

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/items', { productId, quantity })
    setCart(data)
  }

  const updateItem = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/items/${itemId}`, { quantity })
    setCart(data)
  }

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}`)
    setCart(data)
  }

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
```

- [ ] **Step 2: Create Navbar.jsx**

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          🛒 ShopZone
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/products" className="hover:text-blue-200 transition">Products</Link>
          {user ? (
            <>
              <Link to="/cart" className="relative hover:text-blue-200">
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:text-blue-200">Orders</Link>
              {isAdmin && <Link to="/admin" className="hover:text-blue-200">Admin</Link>}
              <button onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded transition font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Create ProductCard.jsx**

```jsx
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover hover:opacity-90 transition"
        />
      </Link>
      <div className="p-4">
        <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
          {product.category?.name || 'Uncategorized'}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
          <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <button
          onClick={() => user ? addToCart(product.id) : window.location.href = '/login'}
          disabled={product.stock === 0}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded-lg transition font-medium"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create Footer.jsx**

```jsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p>© 2024 ShopZone — Built with Spring Boot + React</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Create ProtectedRoute.jsx**

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  return children
}
```

- [ ] **Step 6: Create App.jsx**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add frontend/src/
git commit -m "feat: cart context, navbar, product card, app routing"
```

---

### Task 14: Customer Pages (Home, Products, Detail, Login, Register)

**Files:**
- Create: `frontend/src/pages/Home.jsx`
- Create: `frontend/src/pages/Products.jsx`
- Create: `frontend/src/pages/ProductDetail.jsx`
- Create: `frontend/src/pages/Login.jsx`
- Create: `frontend/src/pages/Register.jsx`

- [ ] **Step 1: Create Home.jsx**

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    api.get('/products?size=6').then(r => setFeatured(r.data.content || []))
  }, [])

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ShopZone</h1>
        <p className="text-xl text-blue-100 mb-8">Discover amazing products at great prices</p>
        <Link to="/products"
          className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold text-lg transition shadow-lg">
          Shop Now
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/products"
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full transition">
            View All Products →
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create Products.jsx**

```jsx
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '0')

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams({ page, size: 9 })
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    api.get(`/products?${params}`).then(r => {
      setProducts(r.data.content || [])
      setTotalPages(r.data.totalPages || 0)
    })
  }, [search, category, page])

  const update = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    p.set('page', '0')
    setSearchParams(p)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text" placeholder="Search products..."
          value={search}
          onChange={e => update('search', e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={e => update('category', e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i}
              onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', i); setSearchParams(p) }}
              className={`w-10 h-10 rounded-lg font-medium transition ${page === i ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-blue-50'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create ProductDetail.jsx**

```jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data))
  }, [id])

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return }
    await addToCart(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <img src={product.imageUrl || 'https://via.placeholder.com/500'} alt={product.name}
          className="w-full md:w-96 h-80 object-cover" />
        <div className="p-8 flex-1">
          <p className="text-blue-600 text-sm font-medium uppercase mb-2">{product.category?.name}</p>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">₹{product.price}</p>
          <p className={`text-sm mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">Quantity:</label>
            <input type="number" min="1" max={product.stock} value={qty}
              onChange={e => setQty(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
              className="border rounded-lg px-3 py-2 w-20 text-center" />
          </div>
          <button onClick={handleAdd} disabled={product.stock === 0}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition ${added ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-300`}>
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create Login.jsx**

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-6">Login to your ShopZone account</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          No account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
        </p>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <strong>Demo:</strong> admin@shopzone.com / admin123
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create Register.jsx**

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handle = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-500 text-center mb-6">Join ShopZone today</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handle} className="space-y-4">
          {['name','email','password'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
              <input type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                required minLength={field === 'password' ? 6 : 1}
                value={form[field]}
                onChange={e => setForm({...form, [field]: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/
git commit -m "feat: home, products, product detail, login, register pages"
```

---

### Task 15: Cart, Checkout & Orders Pages

**Files:**
- Create: `frontend/src/pages/Cart.jsx`
- Create: `frontend/src/pages/Checkout.jsx`
- Create: `frontend/src/pages/Orders.jsx`

- [ ] **Step 1: Create Cart.jsx**

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, updateItem, removeItem } = useCart()
  const navigate = useNavigate()

  const total = cart.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0

  if (!cart.items?.length) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-6xl mb-4">🛒</p>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started</p>
      <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
        Browse Products
      </Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {cart.items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
            <img src={item.product.imageUrl || 'https://via.placeholder.com/80'}
              alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-blue-600 font-bold">₹{item.product.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateItem(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold transition">-</button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button onClick={() => updateItem(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold transition">+</button>
            </div>
            <p className="w-24 text-right font-bold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-600 transition ml-2">✕</button>
          </div>
        ))}
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <span className="text-xl font-bold">Total: ₹{total.toFixed(2)}</span>
          <button onClick={() => navigate('/checkout')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create Checkout.jsx**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { cart } = useCart()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const total = cart.items?.reduce((sum, i) => sum + i.product.price * i.quantity, 0) || 0

  const place = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await api.post('/orders', { shippingAddress: address })
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={place}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
          <textarea required rows={4} value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter your full shipping address..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button type="submit" disabled={loading || !cart.items?.length}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60">
            {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
          </button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        {cart.items?.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-b-0">
            <span className="text-gray-700">{item.product.name} × {item.quantity}</span>
            <span className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create Orders.jsx**

```jsx
import { useEffect, useState } from 'react'
import api from '../api/axios'

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600'
}

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data))
  }, [])

  if (!orders.length) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-6xl mb-4">📦</p>
      <h2 className="text-2xl font-bold">No orders yet</h2>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div>
                <span className="font-bold text-lg">Order #{order.id}</span>
                <span className="text-gray-500 text-sm ml-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-600">₹{order.totalAmount}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3">📍 {order.shippingAddress}</p>
              <div className="space-y-2">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Cart.jsx frontend/src/pages/Checkout.jsx frontend/src/pages/Orders.jsx
git commit -m "feat: cart, checkout, and order history pages"
```

---

### Task 16: Admin Panel Pages

**Files:**
- Create: `frontend/src/pages/admin/AdminDashboard.jsx`
- Create: `frontend/src/pages/admin/AdminProducts.jsx`
- Create: `frontend/src/pages/admin/AdminOrders.jsx`

- [ ] **Step 1: Create AdminDashboard.jsx**

```jsx
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your ShopZone store</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link to="/admin/products"
          className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition group">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold group-hover:text-blue-600 transition">Manage Products</h2>
          <p className="text-gray-500 mt-1">Add, edit, or delete products</p>
        </Link>
        <Link to="/admin/orders"
          className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition group">
          <div className="text-5xl mb-4">🛍️</div>
          <h2 className="text-xl font-bold group-hover:text-blue-600 transition">Manage Orders</h2>
          <p className="text-gray-500 mt-1">View and update order statuses</p>
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create AdminProducts.jsx**

```jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const emptyForm = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    api.get('/products?size=100').then(r => setProducts(r.data.content || []))
    api.get('/categories').then(r => setCategories(r.data))
  }
  useEffect(load, [])

  const submit = async e => {
    e.preventDefault()
    const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), categoryId: form.categoryId || null }
    if (editing) await api.put(`/products/${editing}`, data)
    else await api.post('/products', data)
    setForm(emptyForm); setEditing(null); setShowForm(false); load()
  }

  const edit = p => {
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, imageUrl: p.imageUrl || '', categoryId: p.category?.id || '' })
    setEditing(p.id); setShowForm(true)
  }

  const del = async id => {
    if (confirm('Delete this product?')) { await api.delete(`/products/${id}`); load() }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm) }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-2 text-xl font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
          {['name','description','imageUrl'].map(f => (
            <div key={f} className={f === 'description' ? 'col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{f}</label>
              <input type="text" value={form[f]} onChange={e => setForm({...form,[f]:e.target.value})}
                required={f==='name'}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input type="number" step="0.01" min="0.01" required value={form.price}
              onChange={e => setForm({...form,price:e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input type="number" min="0" required value={form.stock}
              onChange={e => setForm({...form,stock:e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.categoryId} onChange={e => setForm({...form,categoryId:e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">None</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            {editing ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{['Image','Name','Category','Price','Stock','Actions'].map(h=>(
              <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img src={p.imageUrl || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 object-cover rounded" />
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name || '-'}</td>
                <td className="px-4 py-3 font-bold text-blue-600">₹{p.price}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => edit(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => del(p.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create AdminOrders.jsx**

```jsx
import { useEffect, useState } from 'react'
import api from '../../api/axios'

const STATUSES = ['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED']
const statusColors = {
  PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-blue-100 text-blue-700',
  SHIPPED:'bg-purple-100 text-purple-700', DELIVERED:'bg-green-100 text-green-700',
  CANCELLED:'bg-red-100 text-red-600'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  const load = () => api.get('/orders/admin/all').then(r => setOrders(r.data))
  useEffect(load, [])

  const updateStatus = async (id, status) => {
    await api.put(`/orders/admin/${id}/status`, { status })
    load()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 border-b gap-4">
              <div>
                <span className="font-bold">Order #{order.id}</span>
                <span className="text-gray-500 text-sm ml-3">{order.user?.name} ({order.user?.email})</span>
                <span className="text-gray-400 text-sm ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600">₹{order.totalAmount}</span>
                <select value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${statusColors[order.status]} cursor-pointer`}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-sm mb-2">📍 {order.shippingAddress}</p>
              <div className="space-y-1">
                {order.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/admin/
git commit -m "feat: admin dashboard, product management, order management"
```

---

### Task 17: Run Scripts & README

**Files:**
- Create: `scripts/run.bat`
- Create: `scripts/run.sh`
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Create scripts/run.bat (Windows)**

```batch
@echo off
echo ============================================
echo   ShopZone - Online Shopping Platform
echo ============================================
echo.

set JAR_FILE=shopzone-1.0.0.jar

if not exist "%JAR_FILE%" (
    echo [ERROR] JAR file not found: %JAR_FILE%
    echo Please run: cd backend ^&^& mvn clean package -DskipTests
    echo Then copy backend\target\shopzone-1.0.0.jar to this folder.
    pause
    exit /b 1
)

echo [1/2] Setting up database...
echo Make sure PostgreSQL is running and execute:
echo   psql -U postgres -f setup.sql
echo.
echo [2/2] Starting ShopZone...
java -jar %JAR_FILE% ^
  --spring.datasource.url=jdbc:postgresql://localhost:5432/shopzone ^
  --spring.datasource.username=postgres ^
  --spring.datasource.password=postgres

pause
```

- [ ] **Step 2: Create scripts/run.sh (Linux/Mac)**

```bash
#!/bin/bash
set -e

JAR_FILE="shopzone-1.0.0.jar"
echo "============================================"
echo "  ShopZone - Online Shopping Platform"
echo "============================================"

if [ ! -f "$JAR_FILE" ]; then
  echo "[ERROR] JAR not found. Build first:"
  echo "  cd backend && mvn clean package -DskipTests"
  echo "  cp backend/target/shopzone-1.0.0.jar scripts/"
  exit 1
fi

echo "[INFO] Starting ShopZone on http://localhost:8080"
java -jar "$JAR_FILE" \
  --spring.datasource.url=jdbc:postgresql://localhost:5432/shopzone \
  --spring.datasource.username=postgres \
  --spring.datasource.password=postgres
```

```bash
chmod +x scripts/run.sh
```

- [ ] **Step 3: Create .gitignore**

```
# Maven
backend/target/
backend/.mvn/wrapper/maven-wrapper.jar

# Node
frontend/node_modules/
frontend/dist/
frontend/.vite/

# IDE
.idea/
*.iml
.vscode/
*.class

# OS
.DS_Store
Thumbs.db

# Env
*.env
application-local.properties
```

- [ ] **Step 4: Create README.md**

```markdown
# ShopZone — Online Shopping Platform

Full-stack e-commerce platform built with Java Spring Boot + React.

## Tech Stack
- **Backend:** Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA
- **Database:** PostgreSQL 15
- **Frontend:** React 18, Vite 5, Tailwind CSS 3, React Router 6, Axios

## Default Accounts
| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Admin    | admin@shopzone.com     | admin123  |
| Customer | Register on the site   | -         |

## Quick Start (Development)

### Prerequisites
- Java 17+
- PostgreSQL 15+ running on port 5432
- Node.js 20+ (only needed for development)

### 1. Database Setup
```bash
psql -U postgres -f scripts/setup.sql
```

### 2. Run Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Run Frontend (dev mode)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Build Executable JAR (for CD submission)

```bash
cd backend
mvn clean package -DskipTests
```

This builds the frontend and bundles it inside the JAR.
The JAR is at `backend/target/shopzone-1.0.0.jar`.

## Run from JAR (CS Lab / CD)

1. Ensure PostgreSQL is running and `shopzone` database exists
2. Copy `backend/target/shopzone-1.0.0.jar` to `scripts/`
3. **Windows:** Double-click or run `scripts/run.bat`
4. **Linux/Mac:** `bash scripts/run.sh`
5. Open http://localhost:8080

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| GET | /api/products | Public | List/search products |
| GET | /api/products/{id} | Public | Product detail |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/{id} | Admin | Update product |
| DELETE | /api/products/{id} | Admin | Delete product |
| GET | /api/categories | Public | List categories |
| GET | /api/cart | Customer | Get cart |
| POST | /api/cart/items | Customer | Add to cart |
| PUT | /api/cart/items/{id} | Customer | Update quantity |
| DELETE | /api/cart/items/{id} | Customer | Remove item |
| POST | /api/orders | Customer | Place order |
| GET | /api/orders | Customer | My orders |
| GET | /api/orders/admin/all | Admin | All orders |
| PUT | /api/orders/admin/{id}/status | Admin | Update status |
```

- [ ] **Step 5: Commit**

```bash
git add scripts/ .gitignore README.md
git commit -m "chore: run scripts, .gitignore, README"
```

---

### Task 18: Full Build Verification

- [ ] **Step 1: Start PostgreSQL and create the database**

```bash
psql -U postgres -c "CREATE DATABASE shopzone;"
```

- [ ] **Step 2: Build the full project (frontend + backend as one JAR)**

```bash
cd backend
mvn clean package -DskipTests
```

Expected output: `BUILD SUCCESS` and `shopzone-1.0.0.jar` in `backend/target/`

- [ ] **Step 3: Run the JAR and verify**

```bash
java -jar backend/target/shopzone-1.0.0.jar
```

Open http://localhost:8080 — should see the React app.
Open http://localhost:8080/api/products — should return JSON.

- [ ] **Step 4: Copy JAR to scripts folder for CD**

```bash
cp backend/target/shopzone-1.0.0.jar scripts/
```

- [ ] **Step 5: Commit final state**

```bash
git add .
git commit -m "chore: final build verification, JAR ready for CD"
```

---

### Task 19: GitHub Repository Setup

- [ ] **Step 1: Create GitHub repo (run in browser or gh CLI)**

```bash
# If you have GitHub CLI installed:
gh repo create shopzone --public --description "Online Shopping Platform - Spring Boot + React"
```

Or go to https://github.com/new and create `shopzone` manually.

- [ ] **Step 2: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/shopzone.git
git branch -M main
git push -u origin main
```

- [ ] **Step 3: Verify on GitHub**

Open your repo URL — confirm all files are pushed including README, backend, frontend, scripts.

---

### Task 20: CD Preparation

- [ ] **Step 1: Create CD contents folder**

```bash
mkdir -p cd-submission
cp backend/target/shopzone-1.0.0.jar cd-submission/
cp scripts/setup.sql cd-submission/
cp scripts/run.bat cd-submission/
cp scripts/run.sh cd-submission/
cp README.md cd-submission/
```

- [ ] **Step 2: Create instructions.txt for CD**

Create `cd-submission/INSTRUCTIONS.txt`:
```
ShopZone — Online Shopping Platform
====================================

REQUIREMENTS:
  - Java 17 or higher (https://adoptium.net/)
  - PostgreSQL 15 (https://www.postgresql.org/download/)

SETUP STEPS:
  1. Install Java 17+ and PostgreSQL if not already installed
  2. Start PostgreSQL service
  3. Run: psql -U postgres -f setup.sql
  4. Windows: run.bat  |  Linux/Mac: bash run.sh
  5. Open browser: http://localhost:8080

LOGIN:
  Admin:    admin@shopzone.com  / admin123
  Customer: Register a new account on the site

GITHUB:
  https://github.com/YOUR_USERNAME/shopzone
```

- [ ] **Step 3: Final commit**

```bash
git add cd-submission/
git commit -m "chore: CD submission bundle ready"
git push origin main
```

---

## Self-Review

**Spec coverage check:**
- ✅ Java 17 + Spring Boot 3 backend
- ✅ PostgreSQL database with auto-schema creation
- ✅ JWT authentication (register, login)
- ✅ Product catalog with search and category filter
- ✅ Shopping cart (add, update, remove)
- ✅ Checkout and order placement
- ✅ Order history for customers
- ✅ Admin panel (products CRUD, order status updates)
- ✅ Single executable JAR with bundled frontend
- ✅ PostgreSQL setup script
- ✅ run.bat (Windows) + run.sh (Linux/Mac) for CD
- ✅ GitHub repository setup
- ✅ Demo data seeded on first run (admin account + 6 products)

**No placeholders found.**

**Type consistency verified** — all method names, endpoint paths, and field names are consistent across tasks.
