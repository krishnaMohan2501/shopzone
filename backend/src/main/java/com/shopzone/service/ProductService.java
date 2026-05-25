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
