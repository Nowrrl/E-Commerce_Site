package org.example.cs308project.categories;

import org.example.cs308project.categories.category_model;
import org.example.cs308project.categories.category_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories") // 🌟 Public path
public class PublicCategoryController {

    @Autowired
    private category_repository repository;

    @GetMapping
    public List<category_model> getAllPublicCategories() {
        return repository.findAll();
    }
}
