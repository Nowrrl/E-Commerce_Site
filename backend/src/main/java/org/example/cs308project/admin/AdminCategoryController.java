package org.example.cs308project.admin;

import org.example.cs308project.categories.category_model;
import org.example.cs308project.categories.category_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/categories")
public class AdminCategoryController {

    @Autowired
    private category_repository repository;

    @GetMapping
    public List<category_model> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public category_model create(@RequestBody category_model category) {
        if (repository.existsByName(category.getName())) {
            throw new RuntimeException("Category already exists");
        }
        return repository.save(category);
    }

    @PutMapping("/{id}")
    public category_model update(@PathVariable Long id, @RequestBody category_model category) {
        category_model existing = repository.findById(id).orElseThrow();
        existing.setName(category.getName());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
