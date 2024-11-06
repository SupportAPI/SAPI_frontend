package com.seniorcenter.sapi.domain.category.service;

import com.seniorcenter.sapi.domain.category.domain.Category;
import com.seniorcenter.sapi.domain.category.domain.repository.CategoryRepository;
import com.seniorcenter.sapi.domain.category.presentation.dto.request.CreateCategoryRequestDto;
import com.seniorcenter.sapi.domain.category.presentation.dto.response.CategoryResponseDto;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final WorkspaceRepository workspaceRepository;

    public List<CategoryResponseDto> getCategories(UUID workspaceId) {
        List<Category> categories = categoryRepository.findByWorkspaceId(workspaceId);
        return categories.stream()
                .map(CategoryResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponseDto createCategory(CreateCategoryRequestDto createCategoryRequestDto, UUID workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(()->new MainException(CustomException.NOT_FOUND_WORKSPACE));
        categoryRepository.findByWorkspaceIdAndName(workspaceId,createCategoryRequestDto.name())
                .ifPresent(existingCategory -> {
                    throw new MainException(CustomException.DUPLICATE_CATEGORY);
                });

        Category category = Category.createCategory(createCategoryRequestDto.name(),workspace);
        categoryRepository.save(category);
        return new CategoryResponseDto(category);
    }

    @Transactional
    public void removeCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
        categoryRepository.delete(category);
    }
}
