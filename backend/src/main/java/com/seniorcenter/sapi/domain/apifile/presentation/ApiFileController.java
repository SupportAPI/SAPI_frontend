package com.seniorcenter.sapi.domain.apifile.presentation;

import com.seniorcenter.sapi.domain.apifile.presentation.dto.response.FileInfoResponseDto;
import com.seniorcenter.sapi.domain.apifile.service.ApiFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/file")
@RequiredArgsConstructor
public class ApiFileController {
    private final ApiFileService apiFileService;

    @PostMapping
    public FileInfoResponseDto createApiFile(@PathVariable("workspaceId") UUID workspaceId, @RequestParam("file") MultipartFile file) {
        return apiFileService.createApiFile(workspaceId, file);
    }

    @DeleteMapping("/{apiFileId}")
    public void deleteApiFile(@PathVariable("workspaceId") UUID workspaceId, @PathVariable("apiFileId") Long apiFileId) {
        apiFileService.deleteApiFile(workspaceId, apiFileId);
    }

    @GetMapping
    public List<FileInfoResponseDto> getApiFilesByWorkspace(@PathVariable("workspaceId") UUID workspaceId) {
        return apiFileService.getApiFilesByWorkspace(workspaceId);
    }
}
