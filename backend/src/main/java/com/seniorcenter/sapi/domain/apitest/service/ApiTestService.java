package com.seniorcenter.sapi.domain.apitest.service;

import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.UpdateApiDetailRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestDetailResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.TestResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ApiTestService {
    List<ApiTestResponseDto> getConfirmedApisByWorkspaceId(UUID workspaceId);

    ApiTestDetailResponseDto getTestApiByApiId(UUID workspaceId, UUID apiId);

    void updateTestApi(UUID workspaceId, UUID apiId, UpdateApiDetailRequestDto requestDto);

    TestResponseDto testDefaultRequest(String workspaceId, Map<String, String> headers, HttpServletRequest request);

    TestResponseDto testFormDataRequest(String workspaceId, Map<String, String> headers, Map<String, Object> formParams, Map<String, MultipartFile> files, HttpServletRequest request);

    TestResponseDto testJsonRequest(String workspaceId, Map<String, String> headers, Map<String, Object> body, HttpServletRequest request);
}
