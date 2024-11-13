package com.seniorcenter.sapi.domain.apitest.presentation;

import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.UpdateApiDetailRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestDetailResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.TestResponseDto;
import com.seniorcenter.sapi.domain.apitest.service.ApiTestService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class ApiTestController {

    private final ApiTestService apiTestService;

    @GetMapping("/workspaces/{workspaceId}/api-tests")
    public List<ApiTestResponseDto> getTestApis(@PathVariable("workspaceId") UUID workspaceId) {
        return apiTestService.getConfirmedApisByWorkspaceId(workspaceId);
    }

    @GetMapping("/workspaces/{workspaceId}/api-tests/{apiId}")
    public ApiTestDetailResponseDto getTestApi(@PathVariable("workspaceId") UUID workspaceId, @PathVariable("apiId") UUID apiId) {
        return apiTestService.getTestApiByApiId(workspaceId, apiId);
    }

    @PatchMapping("/workspaces/{workspaceId}/api-tests/{apiId}")
    public void updateTestApi(@PathVariable("workspaceId") UUID workspaceId, @PathVariable("apiId") UUID apiId,
                              @RequestBody UpdateApiDetailRequestDto requestDto) {
        apiTestService.updateTestApi(workspaceId, apiId, requestDto);
    }

    @RequestMapping(value = "/workspaces/{workspaceId}/test/**")
    public TestResponseDto testDefaultRequest(
        @PathVariable("workspaceId") String workspaceId,
        @RequestHeader(required = false) Map<String, String> headers,
        HttpServletRequest request
    ) {
        return apiTestService.testDefaultRequest(workspaceId, headers, request);
    }

    @RequestMapping(value = "/workspaces/{workspaceId}/test/**", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TestResponseDto testFormDataRequest(
        @PathVariable("workspaceId") String workspaceId,
        @RequestHeader(required = false) Map<String, String> headers,
        @RequestParam Map<String, MultipartFile> files,
        @RequestParam(required = false) Map<String, Object> formParams,
        HttpServletRequest request
    ) {
        return apiTestService.testFormDataRequest(workspaceId, headers, formParams, files, request);
    }

    @RequestMapping(value = "/workspaces/{workspaceId}/test/**", consumes = MediaType.APPLICATION_JSON_VALUE)
    public TestResponseDto testJsonRequest(
        @PathVariable("workspaceId") String workspaceId,
        @RequestHeader(required = false) Map<String, String> headers,
        @RequestBody Map<String, Object> body,
        HttpServletRequest request
    ) {
        return apiTestService.testJsonRequest(workspaceId, headers, body, request);
    }
}
