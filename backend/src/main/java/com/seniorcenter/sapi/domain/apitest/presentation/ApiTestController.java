package com.seniorcenter.sapi.domain.apitest.presentation;

import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.TestApiRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.UpdateApiDetailRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.ValidateRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestDetailResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.TestResponseDto;
import com.seniorcenter.sapi.domain.apitest.service.ApiTestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/workspaces/{workspaceId}/request")
    public TestResponseDto requestTestApi(
        @PathVariable("workspaceId") UUID workspaceId,
        @RequestBody TestApiRequestDto requestTestApiRequestDto,
        @RequestHeader Map<String, String> headers
    ) {
        return apiTestService.requestTestApi(workspaceId, requestTestApiRequestDto, headers);
    }

    @PostMapping("/workspaces/{workspaceId}/request/{specificationId}")
    public TestResponseDto requestTestApiBySpecificationId(
        @PathVariable("workspaceId") UUID workspaceId,
        @PathVariable("specificationId") UUID specificationId,
        @RequestHeader Map<String, String> headers
    ) {
        return apiTestService.requestTestApiBySpecificationId(workspaceId, specificationId, headers);
    }

    @PostMapping("/workspaces/{workspaceId}/validate/{specificationId}")
    public TestResponseDto validateRequest(
        @PathVariable("workspaceId") UUID workspaceId,
        @PathVariable("specificationId") UUID specificationId,
        @RequestBody ValidateRequestDto validateRequestDto,
        @RequestHeader("X-Test-Type") String testType
    ) {
        return apiTestService.validateRequest(workspaceId, specificationId, validateRequestDto, testType);
    }
}
