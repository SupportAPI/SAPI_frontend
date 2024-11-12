package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiType;
import com.seniorcenter.sapi.domain.api.domain.enums.AuthenticationType;
import com.seniorcenter.sapi.domain.api.domain.enums.ParameterType;
import com.seniorcenter.sapi.domain.api.domain.repository.*;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.SaveDataRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiDetailResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.api.util.KeyValueUtils;
import com.seniorcenter.sapi.domain.api.util.ValueUtils;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestResponseDto;
import com.seniorcenter.sapi.domain.category.domain.Category;
import com.seniorcenter.sapi.domain.category.domain.repository.CategoryRepository;
import com.seniorcenter.sapi.domain.category.presentation.dto.response.CategoryResponseDto;
import com.seniorcenter.sapi.domain.category.service.CategoryService;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.occupation.service.OccupationService;
import com.seniorcenter.sapi.domain.proxy.service.ProxyService;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.RedisUtil;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApiService {

    private final ApiRepository apiRepository;
    private final SpecificationRepository specificationRepository;
    private final MembershipRepository membershipRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;
    private final ApiQueryParameterService apiQueryParameterService;
    private final ApiCookieService apiCookieService;
    private final ApiHeaderService apiHeaderService;
    private final OccupationService occupationService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ValueUtils valueUtils;
    private final UserUtils userUtils;
    private final KeyValueUtils keyValueUtils;
    private final RedisUtil redisUtil;

    @Transactional
    public void createApi(ApiMessage message, UUID workspaceId, UUID apiId, Principal principal) {
        User user = userUtils.getUserFromSecurityPrincipal(principal);

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
            result = valueUtils.updateByValue(message);
        } else if (message.apiType().equals(ApiType.API_NAME)) {
            result = valueUtils.updateByValue(message);
        } else if (message.apiType().equals(ApiType.CATEGORY)) {
            result = valueUtils.update(message);
        } else if (message.apiType().equals(ApiType.API_DESCRIPTION)) {
            result = valueUtils.updateByValue(message);
        } else if (message.apiType().equals(ApiType.PARAMETERS_AUTH_TYPE)) {
            updateAuthType(message, workspaceId, apiId);
            result = valueUtils.updateByValue(message);
        } else if (message.apiType().equals(ApiType.PARAMETERS_QUERY_PARAMETERS)) {
            result = apiQueryParameterService.updateApiQueryParameter(message, apiId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_COOKIES)) {
            result = apiCookieService.updateApiCookie(message, apiId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_HEADERS)) {
            result = apiHeaderService.updateApiHeader(message, apiId);
        } else if (message.apiType().equals(ApiType.API_METHOD)) {
            updateMethod(message, apiId);
            result = valueUtils.updateByValue(message);
        }

        messagingTemplate.convertAndSend("/ws/sub/workspaces/" + workspaceId + "/apis/" + apiId, new ApiMessage(message.apiType(), message.actionType(), result));
    }

    @Transactional
    public void updateApiDB(ApiMessage message, UUID workspaceId, UUID apiId, Principal principal) {

        Object result = null;
        if (message.apiType().equals(ApiType.API_PATH)) {
            updatePath(message, workspaceId, apiId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_QUERY_PARAMETERS)) {
            apiQueryParameterService.updateDBApiQueryParameter(message, workspaceId, apiId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_COOKIES)) {
            apiCookieService.updateDBApiCookie(message, workspaceId);
        } else if (message.apiType().equals(ApiType.PARAMETERS_HEADERS)) {
            apiHeaderService.updateDBApiHeader(message, workspaceId);
        } else if (message.apiType().equals(ApiType.API_DESCRIPTION)) {
            updateDescription(message, workspaceId, apiId);
        } else if (message.apiType().equals(ApiType.API_NAME)) {
            updateApiName(message, workspaceId, apiId);
        }
    }

    public void updatePath(ApiMessage message, UUID workspaceId, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        api.updatePath(data.value());

        String hashKey = workspaceId.toString();
        redisUtil.deleteData(hashKey, data.componentId());
    }

    public void updateMethod(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        api.updateMethod(data.value());
    }

    public void updateDescription(ApiMessage message, UUID workspaceId, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        api.updateDescription(data.value());

        String hashKey = workspaceId.toString();
        redisUtil.deleteData(hashKey, data.componentId());
    }

    public void updateAuthType(ApiMessage message, UUID workspaceId, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        api.updateAuthType(AuthenticationType.valueOf(data.value()));
    }

    public void updateApiName(ApiMessage message, UUID workspaceId, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        api.updateName(data.value());

        String hashKey = workspaceId.toString();
        redisUtil.deleteData(hashKey, data.componentId());
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
        log.info("검증 시작: userId={}, workspaceId={}", user.getId(), workspaceId);
        log.info("API 조회 시작: apiId={}, workspaceId={}", apiId, workspaceId);

        // 유저가 해당 워크스페이스에 포함되어 있는지 검증
        membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId)
                .orElseThrow(() -> new MainException(CustomException.ACCESS_DENIED_EXCEPTION));

        // API가 해당 워크스페이스에 포함되어 있는지 확인
        Api api = apiRepository.findByIdAndWorkspaceId(apiId, workspaceId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        AtomicReference<LocalDateTime> lastModifyDate = new AtomicReference<>(api.getLastModifyDate());

        // 헤더 처리
        List<ApiDetailResponseDto.Parameters.Header> headers = api.getHeaders().stream()
                .map(header -> {
                    if (header.getLastModifyDate().isAfter(lastModifyDate.get())) {
                        lastModifyDate.set(header.getLastModifyDate());
                    }
                    return new ApiDetailResponseDto.Parameters.Header(
                            header.getId().toString(),
                            header.getHeaderKey(),
                            header.getHeaderValue(),
                            header.getDescription(),
                            header.getIsEssential(),
                            header.getIsChecked()
                    );
                })
                .toList();

        // Path Variable 처리
        List<ApiDetailResponseDto.Parameters.PathVariables> pathVariables = api.getPathVariables().stream()
                .map(queryParameter -> {
                    return new ApiDetailResponseDto.Parameters.PathVariables(
                            queryParameter.getId().toString(),
                            queryParameter.getVariableKey(),
                            queryParameter.getVariableValue(),
                            queryParameter.getDescription()
                    );
                })
                .toList();

        // 쿼리 파라미터 처리
        List<ApiDetailResponseDto.Parameters.QueryParameter> queryParameters = api.getQueryParameters().stream()
                .map(queryParameter -> {
                    if (queryParameter.getLastModifyDate().isAfter(lastModifyDate.get())) {
                        lastModifyDate.set(queryParameter.getLastModifyDate());
                    }
                    return new ApiDetailResponseDto.Parameters.QueryParameter(
                            queryParameter.getId().toString(),
                            queryParameter.getParamKey(),
                            queryParameter.getParamValue(),
                            queryParameter.getDescription(),
                            queryParameter.getIsEssential(),
                            queryParameter.getIsChecked()
                    );
                })
                .toList();

        // Parameters 쿠키 처리
        List<ApiDetailResponseDto.Parameters.Cookie> cookies = api.getCookies().stream()
                .map(cookie -> {
                    if (cookie.getLastModifyDate().isAfter(lastModifyDate.get())) {
                        lastModifyDate.set(cookie.getLastModifyDate());
                    }
                    return new ApiDetailResponseDto.Parameters.Cookie(
                            cookie.getId().toString(),
                            cookie.getCookieKey(),
                            cookie.getCookieValue(),
                            cookie.getDescription(),
                            cookie.getIsEssential(),
                            cookie.getIsChecked()
                    );
                })
                .toList();

        ApiDetailResponseDto.Parameters parameters = new ApiDetailResponseDto.Parameters(
                api.getAuthenticationType().name(),
                headers,
                pathVariables,
                queryParameters,
                cookies
        );

        // Body JSON 및 FormData 처리
        ApiDetailResponseDto.Request.JsonData jsonData = api.getBodies().stream()
                .filter(body -> body.getParameterType() == ParameterType.JSON)
                .map(body -> {
                    if (body.getLastModifyDate().isAfter(lastModifyDate.get())) {
                        lastModifyDate.set(body.getLastModifyDate());
                    }
                    return new ApiDetailResponseDto.Request.JsonData(
                            body.getId().toString(),
                            body.getBodyValue()
                    );
                })
                .findFirst()
                .orElse(null);

        List<ApiDetailResponseDto.Request.FormData> formDataList = api.getBodies().stream()
                .filter(body -> body.getParameterType() == ParameterType.TEXT || body.getParameterType() == ParameterType.FILE)
                .map(formData -> {
                    if (formData.getLastModifyDate().isAfter(lastModifyDate.get())) {
                        lastModifyDate.set(formData.getLastModifyDate());
                    }
                    return new ApiDetailResponseDto.Request.FormData(
                            formData.getId().toString(),
                            formData.getBodyKey(),
                            formData.getBodyValue(),
                            formData.getParameterType().name(),
                            formData.getDescription(),
                            formData.getIsEssential(),
                            formData.getIsChecked()
                    );
                })
                .toList();

        ApiDetailResponseDto.Request request = new ApiDetailResponseDto.Request(
                api.getBodyType(),
                jsonData,
                formDataList
        );

        // Responses 처리
        List<ApiDetailResponseDto.Response> responseList = api.getResponses().stream()
                .map(response -> {
                    if (response.getLastModifyDate().isAfter(lastModifyDate.get())) {
                        lastModifyDate.set(response.getLastModifyDate());
                    }
                    return new ApiDetailResponseDto.Response(
                            response.getId().toString(),
                            String.valueOf(response.getCode()),
                            response.getDescription(),
                            response.getBodyType() != null ? response.getBodyType().name() : "",
                            response.getBodyData()
                    );
                })
                .toList();

        // 카테고리 설정
        Category category = categoryRepository.findByWorkspaceIdAndName(workspaceId, api.getCategory())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_CATEGORY));

        // Manager 정보 설정
        String managerEmail = (api.getSpecification().getManager() != null) ? api.getSpecification().getManager().getEmail() : "";
        String managerNickname = (api.getSpecification().getManager() != null) ? api.getSpecification().getManager().getNickname() : "";
        String managerProfileImage = (api.getSpecification().getManager() != null) ? api.getSpecification().getManager().getProfileImage() : "";

        // ApiDetailResponseDto 생성 및 반환
        return new ApiDetailResponseDto(
                api.getSpecification().getId().toString(),
                api.getId().toString(),
                new CategoryResponseDto(category),
                api.getName(),
                api.getMethod().name(),
                api.getPath(),
                api.getDescription(),
                managerEmail,
                managerNickname,
                managerProfileImage,
                parameters,
                request,
                responseList,
                api.getCreatedDate(),
                lastModifyDate.get()
        );
    }
}
