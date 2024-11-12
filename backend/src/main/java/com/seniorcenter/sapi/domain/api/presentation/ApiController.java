package com.seniorcenter.sapi.domain.api.presentation;

import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateApiDetailRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.*;
import com.seniorcenter.sapi.domain.api.service.ApiService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class ApiController {

    private final ApiService apiService;

    @GetMapping("/workspaces/{workspaceId}/apis")
    public List<ApiResponseDto> getApis(@PathVariable("workspaceId") UUID workspaceUUID) {
        return apiService.getApisByWorkspaceId(workspaceUUID);
    }

    @GetMapping("/workspaces/{workspaceId}/apis/{apiId}")
    public ApiDetailResponseDto getApi(@PathVariable("workspaceId") UUID workspaceId, @PathVariable("apiId") UUID apiId) {
        return apiService.getApiByApiId(workspaceId, apiId);
    }

    @GetMapping("/workspaces/{workspaceId}/api-tests")
    public List<ApiTestResponseDto> getTestApis(@PathVariable("workspaceId") UUID workspaceId) {
        return apiService.getConfirmedApisByWorkspaceId(workspaceId);
    }

    @GetMapping("/workspaces/{workspaceId}/api-tests/{apiId}")
    public ApiTestDetailResponseDto getTestApi(@PathVariable("workspaceId") UUID workspaceId, @PathVariable("apiId") UUID apiId) {
        return apiService.getTestApiByApiId(workspaceId, apiId);
    }

    @PatchMapping("/workspaces/{workspaceId}/api-tests/{apiId}")
    public void updateTestApi(@PathVariable("workspaceId") UUID workspaceId, @PathVariable("apiId") UUID apiId,
                              @RequestBody UpdateApiDetailRequestDto requestDto) {
        apiService.updateTestApi(workspaceId, apiId, requestDto);
    }

    @RequestMapping(value = "/workspaces/{workspaceId}/test/**")
    public TestResponseDto testDefaultRequest(
        @PathVariable("workspaceId") String workspaceId,
        @RequestHeader(required = false) Map<String, String> headers,
        HttpServletRequest request
    ) {
        return apiService.testDefaultRequest(workspaceId, headers, request);
    }

    @RequestMapping(value = "/workspaces/{workspaceId}/test/**", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TestResponseDto testFormDataRequest(
        @PathVariable("workspaceId") String workspaceId,
        @RequestHeader(required = false) Map<String, String> headers,
        @RequestParam Map<String, MultipartFile> files,
        @RequestParam(required = false) Map<String, Object> formParams,
        HttpServletRequest request
    ) {
        return apiService.testFormDataRequest(workspaceId, headers, formParams, files, request);
    }

    @RequestMapping(value = "/workspaces/{workspaceId}/test/**", consumes = MediaType.APPLICATION_JSON_VALUE)
    public TestResponseDto testJsonRequest(
        @PathVariable("workspaceId") String workspaceId,
        @RequestHeader(required = false) Map<String, String> headers,
        @RequestBody Map<String, Object> body,
        HttpServletRequest request
    ) {
        return apiService.testJsonRequest(workspaceId, headers, body, request);
    }

}
