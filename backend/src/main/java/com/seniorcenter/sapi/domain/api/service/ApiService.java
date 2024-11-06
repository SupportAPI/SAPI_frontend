package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApiService {

    private final ApiRepository apiRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final SpecificationRepository specificationRepository;
    private final UserUtils userUtils;

    @Transactional
    public void createApi(ApiMessage message, UUID workspaceId, UUID docId, Principal principal) {
        Specification specification = specificationRepository.findById(docId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
        Api api = Api.createApi();
        api.updateSpecification(specification);
        apiRepository.save(api);
        messagingTemplate.convertAndSend("/ws/sub/workspaces/" + workspaceId + "/docs/" + docId + "/apis", message);
    }

//    @Transactional
//    public void removeApi(ApiMessage message, UUID workspaceId, UUID docId, Principal principal) {
//
//        Api api = apiRepository.findById(message.apiUUID());
//
//        if (api == null) {
//            sendErrorMessageToUser("존재하지 않는 API UUID입니다.", workspaceId);
//        } else {
//            apiRepository.delete(api);
//            messagingTemplate.convertAndSend("/ws/sub/workspaces/" + workspaceId + "/docs/" + docId + "/apis", message);
//        }
//    }

    @Transactional
    public void updateApi(ApiMessage message, UUID workspaceId, UUID docId, Principal principal) {
        messagingTemplate.convertAndSend("/ws/sub/workspaces/" + workspaceId + "/docs/" + docId + "/apis", message);
    }

    @Transactional
    public List<ApiResponseDto> getApisByWorkspaceId(UUID workspaceId) {
        List<Specification> specifications = specificationRepository.findSpecificationsByWorkspaceId(workspaceId);
        return specifications.stream()
                .map(specification -> {
                    Api api = apiRepository.findById(specification.getApiId());
                    return new ApiResponseDto(api);
                }).collect(Collectors.toList());
    }

    public void sendErrorMessageToUser(String errorMessage, UUID workspaceUUID) {
        User user = userUtils.getUserFromSecurityContext();
        if (user != null) {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(user.getId()),
                    "/ws/sub/workspace/" + workspaceUUID + "/api/errors",
                    errorMessage
            );
        }
    }

    public List<ApiResponseDto> getApiHistoryBySpecificationId(UUID specificationId) {
        List<Api> apis = apiRepository.findBySpecificationIdOrderByCreatedDateDesc(specificationId);
        return apis.stream()
                .map(api -> {
                    ApiResponseDto apiResponseDto = new ApiResponseDto(api);
                    return apiResponseDto;
                }).collect(Collectors.toList());
    }
}
