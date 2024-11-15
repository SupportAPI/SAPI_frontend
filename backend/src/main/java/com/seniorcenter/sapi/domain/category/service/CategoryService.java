package com.seniorcenter.sapi.domain.category.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.IdValueDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateIdValueRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.api.util.ValueUtils;
import com.seniorcenter.sapi.domain.category.util.CategoryUtils;
import com.seniorcenter.sapi.domain.category.domain.Category;
import com.seniorcenter.sapi.domain.category.domain.repository.CategoryRepository;
import com.seniorcenter.sapi.domain.category.presentation.dto.request.CreateCategoryRequestDto;
import com.seniorcenter.sapi.domain.category.presentation.dto.request.RemoveCategoryRequestDto;
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
    private final CategoryUtils categoryUtils;
    private final ValueUtils valueUtils;
    private final ApiRepository apiRepository;
    private final String defaultCategoryName = "미설정";

    public List<CategoryResponseDto> getCategories(UUID workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));
        List<Category> categories = categoryRepository.findByWorkspaceId(workspaceId);
        return categories.stream()
                .map(CategoryResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public IdValueDto createCategory(ApiMessage message, UUID workspaceId, UUID apiId) {
        CreateCategoryRequestDto createCategoryRequestDto = categoryUtils.createCategory(message);
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));
        categoryRepository.findByWorkspaceIdAndName(workspaceId, createCategoryRequestDto.value())
                .ifPresent(existingCategory -> {
                    throw new MainException(CustomException.DUPLICATE_CATEGORY);
                });

        Category category = Category.createCategory(createCategoryRequestDto.value(), workspace);
        categoryRepository.save(category);

        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));
        api.updateCategory(category.getName());
        return new IdValueDto(category.getId(), category.getName());
    }

    @Transactional
    public IdValueDto removeCategory(ApiMessage message, UUID workspaceId, UUID apiId) {
        RemoveCategoryRequestDto removeCategoryRequestDto = categoryUtils.removeCategory(message);
        log.info(removeCategoryRequestDto.toString());

        Category category = categoryRepository.findById(removeCategoryRequestDto.id())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_CATEGORY));

        if(!category.getWorkspace().equals(workspaceId)){
            throw new MainException(CustomException.NOT_FOUND_CATEGORY);
        }
        categoryRepository.delete(category);

        Category defaultCategory = categoryRepository.findByWorkspaceIdAndName(workspaceId, defaultCategoryName)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_CATEGORY));

        List<Api> apis = apiRepository.findByCategory(defaultCategoryName);
        for(Api api : apis) {
            if(api.getSpecification().getWorkspace().equals(workspaceId)) {
                api.updateCategory(defaultCategory.getName());
            }
        }
        
        return new IdValueDto(defaultCategory.getId(), defaultCategory.getName());
    }

    @Transactional
    public UpdateIdValueRequestDto updateCategory(ApiMessage message, UUID apiId) {
        UpdateIdValueRequestDto updateIdValueRequestDto = valueUtils.update(message);
        return updateIdValueRequestDto;
    }
}
