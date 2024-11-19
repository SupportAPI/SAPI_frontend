package com.seniorcenter.sapi.domain.category.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.category.presentation.dto.request.CreateCategoryRequestDto;
import com.seniorcenter.sapi.domain.category.presentation.dto.request.RemoveCategoryRequestDto;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryUtils {

    private final ObjectMapper objectMapper;

    public CreateCategoryRequestDto createCategory(ApiMessage message) {
        CreateCategoryRequestDto createCategoryRequestDto;
        try {
            createCategoryRequestDto = objectMapper.convertValue(message.message(), new TypeReference<CreateCategoryRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return createCategoryRequestDto;
    }

    public RemoveCategoryRequestDto removeCategory(ApiMessage message) {
        RemoveCategoryRequestDto removeCategoryRequestDto;
        try {
            removeCategoryRequestDto = objectMapper.convertValue(message.message(), new TypeReference<RemoveCategoryRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return removeCategoryRequestDto;
    }
}
