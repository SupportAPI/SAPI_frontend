package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.*;
import com.seniorcenter.sapi.domain.api.domain.enums.ParameterType;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiDetailResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.api.util.ValueUtils;
import com.seniorcenter.sapi.domain.category.service.CategoryService;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.occupation.service.OccupationService;
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
    private final MembershipRepository membershipRepository;
    private final CategoryService categoryService;
    private final UserUtils userUtils;
    private final ApiQueryParameterService apiQueryParameterService;
    private final ApiCookieService apiCookieService;
    private final ApiHeaderService apiHeaderService;
    private final ApiPathService apiPathService;
    private final OccupationService occupationService;
    private final ValueUtils valueUtils;

    @Transactional
    public void createApi(ApiMessage message, UUID workspaceId, UUID apiId, Principal principal) {
        User user = userUtils.getUserFromSecurityPrincipal(principal);
//        Api api = apiRepository.findById(apiId)
//                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        Object result = null;
        if (message.apiType().equals(ApiType.CATEGORY)) {
            result = categoryService.createCategory(message, workspaceId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_QUERY_PARAMETERS)) {
            result = apiQueryParameterService.createApiQueryParameter(message, apiId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_COOKIES)) {
            result = apiCookieService.createApiCookie(workspaceId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_HEADERS)) {
            result = apiHeaderService.createApiHeader(workspaceId);
        } else if (message.apiType().equals(ApiType.OCCUPATION)) {
            result = occupationService.createOccupaction(workspaceId, message, user);
        }

        messagingTemplate.convertAndSend("/ws/sub/workspaces/" + workspaceId + "/apis/" + apiId, new ApiMessage(message.apiType(), message.actionType(), result));
    }

    @Transactional
    public void removeApi(ApiMessage message, UUID workspaceId, UUID apiId, Principal principal) {

        User user = userUtils.getUserFromSecurityPrincipal(principal);
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        Object result = null;
        if (message.apiType().equals(ApiType.CATEGORY)) {
            result = categoryService.removeCategory(message);
        } else if (message.apiType().equals(ApiType.PARAMETERS_QUERY_PARAMETERS)) {
            result = apiQueryParameterService.removeApiQueryParameter(message, apiId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_COOKIES)) {
            result = apiCookieService.removeApiCookie(message, workspaceId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_HEADERS)) {
            result = apiHeaderService.removeApiHeader(message, workspaceId);
        } else if (message.apiType().equals(ApiType.OCCUPATION)) {
            result = occupationService.removeOccupaction(workspaceId, message);
        }

        messagingTemplate.convertAndSend("/ws/sub/workspaces/" + workspaceId + "/apis/" + apiId, new ApiMessage(message.apiType(), message.actionType(), result));
    }

    @Transactional
    public void updateApi(ApiMessage message, UUID workspaceId, UUID apiId, Principal principal) {

        Object result = null;
        if (message.apiType().equals(ApiType.API_PATH)) {
            result = apiPathService.updateApiPath(message, apiId);
        } else if (message.apiType().equals(ApiType.NAME)) {
            result = valueUtils.updateByValue(message);
        } else if (message.apiType().equals(ApiType.CATEGORY)) {
            result = valueUtils.update(message);
        } else if (message.apiType().equals(ApiType.DESCRIPTION)) {
            result = valueUtils.updateByValue(message);
        } else if (message.apiType().equals(ApiType.PARAMETERS_AUTH_TYPE)) {
            result = valueUtils.update(message);
        } else if (message.apiType().equals(ApiType.PARAMETERS_QUERY_PARAMETERS)) {
            result = apiQueryParameterService.updateApiQueryParameter(message, apiId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_COOKIES)) {
            result = apiCookieService.updateApiCookie(message, apiId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_HEADERS)) {
            result = apiHeaderService.updateApiHeader(message, apiId);
        }

        messagingTemplate.convertAndSend("/ws/sub/workspaces/" + workspaceId + "/apis/" + apiId, new ApiMessage(message.apiType(), message.actionType(), result));
    }

    @Transactional
    public List<ApiResponseDto> getApisByWorkspaceId(UUID workspaceId) {
        List<Specification> specifications = specificationRepository.findSpecificationsByWorkspaceId(workspaceId);
        return specifications.stream()
                .map(specification -> {
                    Api api = apiRepository.findById(specification.getConfirmedApiId())
                            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
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
                api.getBodies().stream()
                        .filter(body -> body.getParameterType() == ParameterType.JSON)
                        .map(body -> new ApiDetailResponseDto.Request.JsonData(
                                body.getId().toString(),
                                body.getBodyValue()
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
                api.getSpecification().getId().toString(),
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
