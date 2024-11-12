package com.seniorcenter.sapi.domain.apifile.service;

import com.seniorcenter.sapi.domain.apifile.domain.repository.ApiFileRepository;
import com.seniorcenter.sapi.domain.apifile.domain.ApiFile;
import com.seniorcenter.sapi.domain.apifile.presentation.dto.response.FileInfoResponseDto;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ApiFileServiceImpl implements ApiFileService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final WorkspaceRepository workspaceRepository;
    private final ApiFileRepository apiFileRepository;
    private final UserUtils userUtils;
    private final MembershipRepository membershipRepository;

    @Override
    @Transactional
    public FileInfoResponseDto createApiFile(UUID workspaceId, MultipartFile file) {
        User user = userUtils.getUserFromSecurityContext();
        Workspace workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));

        if (membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId).isEmpty()) {
            throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new MainException(CustomException.FILE_SIZE_EXCEEDED);
        }

        try {
            ApiFile apiFile = ApiFile.builder()
                .workspace(workspace)
                .fileName(file.getOriginalFilename())
                .fileData(file.getBytes())
                .build();
            apiFileRepository.save(apiFile);
            return new FileInfoResponseDto(apiFile.getId(), apiFile.getFileName());
        } catch (IOException e) {
            throw new MainException(CustomException.FILE_PROCESSING_EXCEPTION);
        }
    }

    @Override
    @Transactional
    public void deleteApiFile(UUID workspaceId, Long apiFileId) {
        User user = userUtils.getUserFromSecurityContext();
        Workspace workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));

        if (membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId).isEmpty()) {
            throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        ApiFile apiFile = apiFileRepository.findById(apiFileId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_FILE));
        apiFileRepository.delete(apiFile);
    }

    @Override
    public List<FileInfoResponseDto> getApiFilesByWorkspace(UUID workspaceId) {
        User user = userUtils.getUserFromSecurityContext();
        Workspace workspace = workspaceRepository.findById(workspaceId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));

        if (membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId).isEmpty()) {
            throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        List<ApiFile> files = apiFileRepository.findByWorkspace(workspace);

        return files.stream()
            .map(file -> new FileInfoResponseDto(file.getId(), file.getFileName()))
            .collect(Collectors.toList());
    }

}
