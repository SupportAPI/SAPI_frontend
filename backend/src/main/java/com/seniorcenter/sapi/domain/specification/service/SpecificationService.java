package com.seniorcenter.sapi.domain.specification.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.SpecificationMessage;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationCategoryResponseDto;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationIdNameResponseDto;
import com.seniorcenter.sapi.domain.specification.presentation.dto.response.SpecificationResponseDto;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.aws.ApiLambdaService;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SpecificationService {

    private final SpecificationRepository specificationRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final WorkspaceRepository workspaceRepository;
    private final ApiRepository apiRepository;
    private final UserUtils userUtils;
    private final ApiLambdaService apiLambdaService;

    @Transactional
    public void createSpecification(SpecificationMessage message, UUID worksapceId, Principal principal) {
        Api api = Api.createApi();
        apiRepository.save(api);
        Workspace workspace = workspaceRepository.findById(worksapceId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));
        Specification specification = Specification.createSpecification(api.getId(), workspace);
        api.updateSpecification(specification);
        specificationRepository.save(specification);
        sendOriginMessageToAll(message, worksapceId);
    }

    @Transactional
    public void removeSpecification(SpecificationMessage message, UUID worksapceId, Principal principal) {
        UUID specificationId = UUID.fromString((String) message.message());
        Specification specification = specificationRepository.findById(specificationId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        if (specification == null) {
            sendErrorMessageToUser("존재하지 않는 API 명세 UUID입니다.", worksapceId);
        } else {
            specificationRepository.delete(specification);
            sendOriginMessageToAll(message, worksapceId);
        }
    }

    @Transactional
    public void updateSpecification(SpecificationMessage message, UUID worksapceId, Principal principal) {

    }

    @Transactional
    public List<SpecificationResponseDto> getSpecificationsByWorkspaceId(UUID workspaceId) {
        List<Specification> specifications = specificationRepository.findSpecificationsByWorkspaceId(workspaceId);
        return specifications.stream()
                .map(specification -> {
                    Api api = apiRepository.findById(specification.getConfirmedApiId())
                            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
                    return new SpecificationResponseDto(api, specification);
                }).collect(Collectors.toList());
    }

    @Transactional
    public List<SpecificationCategoryResponseDto> getSpecificationsIdAndNamesByWorkspaceId(UUID workspaceId) {
        List<Specification> specifications = specificationRepository.findSpecificationsByWorkspaceId(workspaceId);

        Map<String, Integer> categoryMap = new HashMap<>();
        AtomicInteger categoryIndex = new AtomicInteger();
        List<SpecificationCategoryResponseDto> categoryResponseDtos = new ArrayList<>();
        specifications.stream()
                .map(specification -> {
                    Api api = apiRepository.findById(specification.getConfirmedApiId())
                            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
                    if (!categoryMap.containsKey(api.getCategory())) {
                        categoryMap.put(api.getCategory(), categoryIndex.incrementAndGet() - 1);
                        categoryResponseDtos.add(new SpecificationCategoryResponseDto(api.getCategory(), new ArrayList<>()));
                        System.out.println(categoryMap.get(api.getCategory()));
                    }
                    categoryResponseDtos.get(categoryMap.get(api.getCategory()))
                            .apis().add(new SpecificationIdNameResponseDto(api.getId(), specification.getId(), api.getName()));
                    return new SpecificationIdNameResponseDto(api.getId(), specification.getId(), api.getName());
                }).collect(Collectors.toList());

        return categoryResponseDtos;
    }

    public void sendErrorMessageToUser(String errorMessage, UUID workspaceUUID) {
        User user = userUtils.getUserFromSecurityContext();
        if (user != null) {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(user.getId()),
                    "/ws/sub/workspaces/" + workspaceUUID + "/docs/errors",
                    errorMessage
            );
        }
    }

    public void sendOriginMessageToAll(SpecificationMessage message, UUID worksapceUUId) {
        messagingTemplate.convertAndSend("/ws/sub/workspaces/" + worksapceUUId + "/docs", message);
    }

    @Transactional
    public UUID createSpecificationByApi(UUID workspaceId) {
        String tempLambdaId = "1"; // 임시 lambda ID
        Api api = Api.createApi();
        apiRepository.save(api);
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));
        Specification specification = Specification.createSpecification(api.getId(), workspace);
        api.updateSpecification(specification);
        specificationRepository.save(specification);
        return specification.getId();
    }

    @Transactional
    public void removeSpecificationByApi(UUID specificationId) {
        Specification specification = specificationRepository.findById(specificationId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
        specificationRepository.delete(specification);
    }

    @Transactional
    public SpecificationResponseDto confirmSpecificationApiId(UUID specificationId) {
        Specification specification = specificationRepository.findById(specificationId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
        Api api = apiRepository.findTopBySpecificationIdOrderByCreatedDateDesc(specificationId).orElseThrow();
        specification.updateConfirmedApiId(api.getId());
        Api newApi = Api.createApi();
        apiRepository.save(newApi);
        newApi.updateSpecification(specification);
        newApi.updateApi(api);

        apiLambdaService.createLambda(specificationId);
        return new SpecificationResponseDto(api, specification);
    }

}
