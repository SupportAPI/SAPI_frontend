package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.enums.ParameterType;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.ApiDetailResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.ApiResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
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
    private final MembershipRepository membershipRepository;
    private final UserUtils userUtils;

    @Transactional
    public void createApi(ApiMessage message) {
        Specification specification = specificationRepository.findById(message.specificationUUID())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
        Api api = Api.createApi();
        api.updateSpecification(specification);
        apiRepository.save(api);
        sendOriginMessageToAll(message);
    }

    @Transactional
    public void removeApi(ApiMessage message) {
        Api api = apiRepository.findById(message.apiUUID());

        if (api == null) {
            sendErrorMessageToUser("존재하지 않는 API UUID입니다.", message.workspaceUUID());
        } else {
            apiRepository.delete(api);
            sendOriginMessageToAll(message);
        }
    }

    @Transactional
    public void updateApi() {
    }

    @Transactional
    public List<ApiResponseDto> getApisByWorkspaceId(UUID workspaceId) {
        List<Specification> specifications = specificationRepository.findSpecificationsByWorkspaceId(workspaceId);
        return specifications.stream()
                .map(specification -> {
                    Api api = apiRepository.findById(specification.getConfirmedApiId());
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

    public void sendOriginMessageToAll(ApiMessage message) {
        messagingTemplate.convertAndSend("/ws/sub/workspace/" + message.workspaceUUID() + "/api", message);
    }

    public List<ApiResponseDto> getApiHistoryBySpecificationId(UUID specificationId) {
        List<Api> apis = apiRepository.findBySpecificationIdOrderByCreatedDateDesc(specificationId);
        return apis.stream()
                .map(api -> {
                    ApiResponseDto apiResponseDto = new ApiResponseDto(api);
                    return apiResponseDto;
                }).collect(Collectors.toList());
    }

    public ApiDetailResponseDto getApiByApiId(UUID workspaceId, UUID apiId) {
        User user = userUtils.getUserFromSecurityContext();
        // 유저가 해당 워크스페이스에 포함되어 있는지 검증
        membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId)
                .orElseThrow(() -> new MainException(CustomException.ACCESS_DENIED_EXCEPTION));

        // API가 해당 워크스페이스에 포함되어 있는지 확인
        Api api = apiRepository.findByIdAndWorkspaceId(apiId, workspaceId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        ApiDetailResponseDto.Parameters parameters = new ApiDetailResponseDto.Parameters(
                api.getAuthenticationType().name(),
                api.getHeaders().stream()
                        .map(header -> new ApiDetailResponseDto.Parameters.Header(
                                header.getId().toString(),
                                header.getHeaderKey(),
                                header.getHeaderValue(),
                                header.getDescription()
                        )).toList(),
                api.getQueryParameters().stream()
                        .map(queryParameter -> new ApiDetailResponseDto.Parameters.QueryParameter(
                                queryParameter.getId().toString(),
                                queryParameter.getParamKey(),
                                queryParameter.getParamValue(),
                                queryParameter.getDescription()
                        )).toList(),
                api.getCookies().stream()
                        .map(cookie -> new ApiDetailResponseDto.Parameters.Cookie(
                                cookie.getId().toString(),
                                cookie.getCookieKey(),
                                cookie.getCookieValue(),
                                cookie.getDescription()
                        )).toList()
        );

        ApiDetailResponseDto.Request request = new ApiDetailResponseDto.Request(
                api.getBodyType(),
                "",
                api.getBodies().stream()
                        .filter(body -> body.getParameterType() == ParameterType.JSON)
                        .map(body -> new ApiDetailResponseDto.Request.FormData(
                                body.getId().toString(),
                                body.getBodyKey(),
                                body.getBodyValue(),
                                body.getParameterType().name(),
                                body.getDescription()
                        )).findFirst()
                        .orElse(null),
                api.getBodies().stream()
                        .filter(body -> body.getParameterType() == ParameterType.TEXT || body.getParameterType() == ParameterType.FILE)
                        .map(formData -> new ApiDetailResponseDto.Request.FormData(
                                formData.getId().toString(),
                                formData.getBodyKey(),
                                formData.getBodyValue(),
                                formData.getParameterType().name(),
                                formData.getDescription()
                        )).toList()
        );

        List<ApiDetailResponseDto.Response> responseList = api.getResponses().stream()
                .map(response -> new ApiDetailResponseDto.Response(
                        response.getId().toString(),
                        String.valueOf(response.getCode()),
                        response.getDescription(),
                        response.getBodyType() != null ? response.getBodyType().name() : "",
                        response.getBodyData()
                )).toList();

        String managerEmail = (api.getSpecification().getManager() != null) ? api.getSpecification().getManager().getEmail() : "";
        String managerNickname = (api.getSpecification().getManager() != null) ? api.getSpecification().getManager().getNickname() : "";
        String managerProfileImage = (api.getSpecification().getManager() != null) ? api.getSpecification().getManager().getProfileImage() : "";


        return new ApiDetailResponseDto(
                workspaceId.toString(),
                api.getId().toString(),
                api.getCategory(),
                api.getName(),
                api.getMethod().name(),
                api.getPath(),
                api.getDescription(),
                managerEmail,
                managerNickname,
                managerProfileImage,
                parameters,
                request,
                responseList
        );
    }
}
