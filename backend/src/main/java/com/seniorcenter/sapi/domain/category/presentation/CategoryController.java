package com.seniorcenter.sapi.domain.category.presentation;

import com.seniorcenter.sapi.domain.category.presentation.dto.request.CreateCategoryRequestDto;
import com.seniorcenter.sapi.domain.category.presentation.dto.response.CategoryResponseDto;
import com.seniorcenter.sapi.domain.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/workspaces/{workspaceId}/categories")
    public List<CategoryResponseDto> getCategories(@PathVariable("workspaceId") UUID workspaceId) {
        return  categoryService.getCategories(workspaceId);
    }

    @PostMapping("/workspaces/{workspaceId}/categories")
    public CategoryResponseDto createCategory(@PathVariable("workspaceId") UUID workspaceId,
                                              @RequestBody CreateCategoryRequestDto createCategoryRequestDto){
        return categoryService.createCategory(createCategoryRequestDto,workspaceId);
    }

    @DeleteMapping("/workspaces/{workspaceId}/categories/{categoryId}")
    public void deleteCategory(@PathVariable("workspaceId") UUID workspaceId, @PathVariable("categoryId") Long categoryId){
        categoryService.removeCategory(categoryId);
    }

}
