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
