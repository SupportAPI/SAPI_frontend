package com.seniorcenter.sapi.domain.apitest.service;

import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.TestApiRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.UpdateApiDetailRequestDto;
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
}
