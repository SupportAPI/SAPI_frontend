package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.ApiResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public void createApi(ApiMessage message) {
        Specification specification = specificationRepository.findById(message.specificationUUID());
        Api api = Api.createApi();
        api.updateSpecification(specification);
        apiRepository.save(api);
        sendOriginMessageToAll(message);
    }

    @Transactional
    public void removeApi(ApiMessage message) {
        Api api = apiRepository.findById(message.apiUUID());

        if(api==null){
            sendErrorMessageToUser("존재하지 않는 API UUID입니다.",message.workspaceUUID());
        }
        else{
            apiRepository.delete(api);
            sendOriginMessageToAll(message);
        }
    }

    @Transactional
    public void updateApi() {}

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
                    "/ws/sub/workspace/"+workspaceUUID+"/api/errors",
                    errorMessage
            );
        }
    }

    public void sendOriginMessageToAll(ApiMessage message) {
        messagingTemplate.convertAndSend("/ws/sub/workspace/" + message.workspaceUUID() + "/api", message);
    }
}
