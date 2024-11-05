package com.seniorcenter.sapi.domain.api.presentation;

import com.seniorcenter.sapi.domain.api.presentation.dto.ApiDetailResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.ApiResponseDto;
import com.seniorcenter.sapi.domain.api.service.ApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
}
