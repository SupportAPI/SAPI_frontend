package com.seniorcenter.sapi.domain.api.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.category.presentation.dto.request.CreateCategoryRequestDto;
import com.seniorcenter.sapi.domain.category.presentation.dto.request.RemoveCategoryRequestDto;
import com.seniorcenter.sapi.domain.category.presentation.dto.response.CategoryResponseDto;
import com.seniorcenter.sapi.domain.category.service.CategoryService;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CategoryUtils {

    private final CategoryService categoryService;
    private final ObjectMapper objectMapper;

    public CategoryResponseDto createCategory(ApiMessage message, UUID workspaceId) {
        CreateCategoryRequestDto createCategoryRequestDto;
        try {
            createCategoryRequestDto = objectMapper.convertValue(message.message(), new TypeReference<CreateCategoryRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return categoryService.createCategory(createCategoryRequestDto, workspaceId);
    }

    public void removeCategory(ApiMessage message) {
        RemoveCategoryRequestDto removeCategoryRequestDto;
        try {
            removeCategoryRequestDto = objectMapper.convertValue(message.message(), new TypeReference<RemoveCategoryRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        categoryService.removeCategory(removeCategoryRequestDto.categoryId());
    }
}
