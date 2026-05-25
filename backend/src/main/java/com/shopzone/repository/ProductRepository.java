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
