package com.seniorcenter.sapi.domain.apifile.service;

import com.seniorcenter.sapi.domain.apifile.presentation.dto.response.FileInfoResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ApiFileService {
    FileInfoResponseDto createApiFile(UUID workspaceId, MultipartFile file);

    void deleteApiFile(UUID workspaceId, Long apiFileId);

    List<FileInfoResponseDto> getApiFilesByWorkspace(UUID workspaceId);
}
