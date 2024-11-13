package com.seniorcenter.sapi.domain.api.presentation.dto.response;

import com.seniorcenter.sapi.domain.api.presentation.dto.ParametersDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.RequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.ResponseDto;
import com.seniorcenter.sapi.domain.category.presentation.dto.response.CategoryResponseDto;

import java.time.LocalDateTime;
import java.util.List;

public record ApiDetailResponseDto(
        String docId,
        String apiId,
        CategoryResponseDto category,
        String name,
        String method,
        String path,
        String description,
        String managerEmail,
        String managerName,
        String managerProfileImage,
        ParametersDto parameters,
        RequestDto request,
        List<ResponseDto> response,
        LocalDateTime createdDate,
        LocalDateTime lastModifyDate
) {
}
