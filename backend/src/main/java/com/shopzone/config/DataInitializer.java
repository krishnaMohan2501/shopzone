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
