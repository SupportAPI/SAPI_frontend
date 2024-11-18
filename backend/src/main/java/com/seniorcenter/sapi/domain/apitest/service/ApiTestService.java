package com.seniorcenter.sapi.domain.apitest.service;

import com.seniorcenter.sapi.domain.api.domain.ApiResponse;
import com.seniorcenter.sapi.domain.apitest.presentation.TestResponseEntityDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.TestApiRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.UpdateApiDetailRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.ValidateRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestDetailResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.TestResponseDto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ApiTestService {
    List<ApiTestResponseDto> getConfirmedApisByWorkspaceId(UUID workspaceId);

    ApiTestDetailResponseDto getTestApiByApiId(UUID workspaceId, UUID apiId);

    void updateTestApi(UUID workspaceId, UUID apiId, UpdateApiDetailRequestDto requestDto);

    TestResponseDto requestTestApi(UUID workspaceId, TestApiRequestDto requestTestApiRequestDto, Map<String, String> headers);

    TestResponseDto requestTestApiBySpecificationId(UUID workspaceId, UUID specificationId, Map<String, String> headers);

    TestResponseDto validateRequest(UUID workspaceId, UUID specificationId, ValidateRequestDto validateRequestDto, String testType);

    TestResponseDto toTestResponseDto(
        UUID specificationId,
        TestResponseEntityDto testResponseEntityDto,
        Map<String, String> requestSize,
        Map<String, String> responseSize,
        ApiResponse mockResponse,
        long responseTime,
        String testType,
        String bodyString
    );
}
