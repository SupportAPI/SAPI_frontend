package com.seniorcenter.sapi.domain.category.presentation.dto.response;

import com.seniorcenter.sapi.domain.category.domain.Category;

public record CategoryResponseDto(
        Long categoryId,
        String name
) {
    public CategoryResponseDto(Category category) {
        this(category.getId(), category.getName());
    }
}
