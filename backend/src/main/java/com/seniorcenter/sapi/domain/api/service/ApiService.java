package com.seniorcenter.sapi.domain.api.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seniorcenter.sapi.domain.api.domain.*;
import com.seniorcenter.sapi.domain.api.domain.enums.ParameterType;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiBodyRepository;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiCookieRepository;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiHeaderRepository;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiPathVariableRepository;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiQueryParameterRepository;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateApiDetailRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.*;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.category.domain.Category;
import com.seniorcenter.sapi.domain.category.domain.repository.CategoryRepository;
import com.seniorcenter.sapi.domain.category.presentation.dto.response.CategoryResponseDto;
import com.seniorcenter.sapi.domain.api.util.ValueUtils;
import com.seniorcenter.sapi.domain.category.service.CategoryService;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.occupation.service.OccupationService;
import com.seniorcenter.sapi.domain.proxy.service.ProxyService;
import com.seniorcenter.sapi.domain.proxy.service.ServerRequestInfoDto;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
    private final ApiHeaderRepository apiHeaderRepository;
    private final ApiPathVariableRepository apiPathVariableRepository;
    private final ApiQueryParameterRepository apiQueryParameterRepository;
    private final ApiCookieRepository apiCookieRepository;
    private final ApiBodyRepository apiBodyRepository;
    private final CategoryService categoryService;
    private final ApiQueryParameterService apiQueryParameterService;
    private final ApiCookieService apiCookieService;
    private final ApiHeaderService apiHeaderService;
    private final ApiPathService apiPathService;
    private final OccupationService occupationService;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ValueUtils valueUtils;
    private final UserUtils userUtils;
    private final WorkspaceRepository workspaceRepository;
    private final ProxyService proxyService;

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
            result = apiPathService.updateApiPath(message, apiId);
        } else if (message.apiType().equals(ApiType.API_NAME)) {
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
                    header.getDescription()
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
                    queryParameter.getDescription()
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
                    cookie.getDescription()
                );
            })
            .toList();

        ApiDetailResponseDto.Parameters parameters = new ApiDetailResponseDto.Parameters(
            api.getAuthenticationType().name(),
            headers,
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
                    formData.getDescription()
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
        Category category = categoryRepository.findByName(api.getCategory())
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

    public List<ApiTestResponseDto> getConfirmedApisByWorkspaceId(UUID workspaceId) {
        return apiRepository.findConfirmedApisByWorkspaceId(workspaceId);
    }

    public ApiTestDetailResponseDto getTestApiByApiId(UUID workspaceId, UUID apiId) {
        User user = userUtils.getUserFromSecurityContext();

        // 유저가 해당 워크스페이스에 포함되어 있는지 검증
        membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId)
            .orElseThrow(() -> new MainException(CustomException.ACCESS_DENIED_EXCEPTION));

        // API가 해당 워크스페이스에 포함되어 있는지 확인
        Api api = apiRepository.findByIdAndWorkspaceId(apiId, workspaceId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        Specification specification = api.getSpecification();

        // 헤더 처리
        List<ApiTestDetailResponseDto.Parameters.Header> headers = api.getHeaders().stream()
            .map(header -> {
                return new ApiTestDetailResponseDto.Parameters.Header(
                    header.getId().toString(),
                    header.getHeaderKey(),
                    header.getHeaderValue(),
                    header.getDescription()
                );
            })
            .toList();

        // Path Variable 처리
        List<ApiTestDetailResponseDto.Parameters.PathVariables> pathVariables = api.getPathVariables().stream()
            .map(queryParameter -> {
                return new ApiTestDetailResponseDto.Parameters.PathVariables(
                    queryParameter.getId().toString(),
                    queryParameter.getVariableKey(),
                    queryParameter.getVariableValue(),
                    queryParameter.getDescription()
                );
            })
            .toList();

        // 쿼리 파라미터 처리
        List<ApiTestDetailResponseDto.Parameters.QueryParameter> queryParameters = api.getQueryParameters().stream()
            .map(queryParameter -> {
                return new ApiTestDetailResponseDto.Parameters.QueryParameter(
                    queryParameter.getId().toString(),
                    queryParameter.getParamKey(),
                    queryParameter.getParamValue(),
                    queryParameter.getDescription()
                );
            })
            .toList();

        // Parameters 쿠키 처리
        List<ApiTestDetailResponseDto.Parameters.Cookie> cookies = api.getCookies().stream()
            .map(cookie -> {
                return new ApiTestDetailResponseDto.Parameters.Cookie(
                    cookie.getId().toString(),
                    cookie.getCookieKey(),
                    cookie.getCookieValue(),
                    cookie.getDescription()
                );
            })
            .toList();

        ApiTestDetailResponseDto.Parameters parameters = new ApiTestDetailResponseDto.Parameters(
            api.getAuthenticationType().name(),
            headers,
            pathVariables,
            queryParameters,
            cookies
        );

        // Body JSON 및 FormData 처리
        ApiTestDetailResponseDto.Request.JsonData jsonData = api.getBodies().stream()
            .filter(body -> body.getParameterType() == ParameterType.JSON)
            .map(body -> {
                return new ApiTestDetailResponseDto.Request.JsonData(
                    body.getId().toString(),
                    body.getBodyValue()
                );
            })
            .findFirst()
            .orElse(null);

        List<ApiTestDetailResponseDto.Request.FormData> formDataList = api.getBodies().stream()
            .filter(body -> body.getParameterType() == ParameterType.TEXT || body.getParameterType() == ParameterType.FILE)
            .map(formData -> {
                return new ApiTestDetailResponseDto.Request.FormData(
                    formData.getId().toString(),
                    formData.getBodyKey(),
                    formData.getBodyValue(),
                    formData.getParameterType().name(),
                    formData.getDescription()
                );
            })
            .toList();

        ApiTestDetailResponseDto.Request request = new ApiTestDetailResponseDto.Request(
            api.getBodyType(),
            jsonData,
            formDataList
        );

        // Manager 정보 설정
        String managerEmail = (api.getSpecification().getManager() != null) ? api.getSpecification().getManager().getEmail() : "";
        String managerNickname = (api.getSpecification().getManager() != null) ? api.getSpecification().getManager().getNickname() : "";
        String managerProfileImage = (api.getSpecification().getManager() != null) ? api.getSpecification().getManager().getProfileImage() : "";

        // ApiTestDetailResponseDto 생성 및 반환
        return new ApiTestDetailResponseDto(
            api.getSpecification().getId().toString(),
            api.getId().toString(),
            api.getName(),
            api.getMethod().name(),
            api.getPath(),
            specification.getLocalStatus(),
            specification.getServerStatus(),
            managerEmail,
            managerNickname,
            managerProfileImage,
            parameters,
            request
        );
    }

    public void updateTestApi(UUID workspaceId, UUID apiId, UpdateApiDetailRequestDto requestDto) {
        requestDto.parameters().headers().forEach(headerDto -> {
            apiHeaderRepository.findById(Long.parseLong(headerDto.headerId()))
                .ifPresent(header -> {
                    header.updateApiHeaderValue(headerDto.headerValue());
                    apiHeaderRepository.save(header);
                });
        });

        requestDto.parameters().pathVariables().forEach(pathVariableDto -> {
            apiPathVariableRepository.findById(Long.parseLong(pathVariableDto.pathVariableId()))
                .ifPresent(pathVariable -> {
                    pathVariable.updateApiPathVariableValue(pathVariableDto.pathVariableValue());
                    apiPathVariableRepository.save(pathVariable);
                });
        });

        requestDto.parameters().queryParameters().forEach(queryParameterDto -> {
            apiQueryParameterRepository.findById(Long.parseLong(queryParameterDto.queryParameterId()))
                .ifPresent(queryParameter -> {
                    queryParameter.updateApiQueryParameterValue(queryParameterDto.queryParameterValue());
                    apiQueryParameterRepository.save(queryParameter);
                });
        });

        requestDto.parameters().cookies().forEach(cookieDto -> {
            apiCookieRepository.findById(Long.parseLong(cookieDto.cookieId()))
                .ifPresent(cookie -> {
                    cookie.updateCookieValue(cookieDto.cookieValue());
                    apiCookieRepository.save(cookie);
                });
        });

        if (requestDto.request().json() != null) {
            apiBodyRepository.findById(Long.parseLong(requestDto.request().json().jsonDataId()))
                .ifPresent(body -> {
                    body.updateBodyValue(requestDto.request().json().jsonDataValue());
                    apiBodyRepository.save(body);
                });
        }

        requestDto.request().formData().forEach(formDataDto -> {
            apiBodyRepository.findById(Long.parseLong(formDataDto.formDataId()))
                .ifPresent(body -> {
                    body.updateBodyValue(formDataDto.formDataValue());
                    apiBodyRepository.save(body);
                });
        });
    }

    public TestResponseDto testDefaultRequest(String workspaceId, Map<String, String> headers, HttpMethod method, HttpServletRequest request) {
        String path = request.getRequestURI().replace("/api/workspace/" + workspaceId + "/test", "");
        String queryString = request.getQueryString() == null ? "" : "?" + request.getQueryString();
        String testType = headers.containsKey("sapi-local-domain") ? "Local" : "Server";
        String domain = testType.equals("Local")
            ? headers.get("sapi-local-domain")
            : workspaceRepository.findById(UUID.fromString(workspaceId))
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE)).getDomain();

        String url = domain + path + queryString;

        Api matchingApi = getMatchingApi(workspaceId, method, path);

        ApiResponse http2xxResponse = matchingApi.getResponses() != null
            ? matchingApi.getResponses().stream()
            .filter(response -> response.getCode() >= 200 && response.getCode() < 300)
            .findFirst()
            .orElse(null)
            : null;

        HttpHeaders httpHeaders = new HttpHeaders();
        headers.forEach((key, value) -> {
            if (!"sapi-local-domain".contains(key.toLowerCase())) {
                httpHeaders.add(key, value);
            }
        });

        ServerRequestInfoDto serverRequestInfoDto = new ServerRequestInfoDto(url, httpHeaders);

        long startTime = System.currentTimeMillis();

        Mono<ResponseEntity<byte[]>> responseEntityMono = proxyService.formDataRequest(serverRequestInfoDto, Map.of(), Map.of(), method);

        return responseEntityMono.map(responseEntity -> toTestResponseDto(responseEntity, httpHeaders, Map.of(), http2xxResponse, startTime, testType)).block();
    }


    public TestResponseDto testFormDataRequest(String workspaceId, Map<String, String> headers, HttpMethod method, Map<String, Object> formParams, Map<String, MultipartFile> files, HttpServletRequest request) {
        String path = request.getRequestURI().replace("/api/workspace/" + workspaceId + "/test", "");
        String queryString = request.getQueryString() == null ? "" : "?" + request.getQueryString();
        String testType = headers.containsKey("sapi-local-domain") ? "Local" : "Server";
        String domain = testType.equals("Local")
            ? headers.get("sapi-local-domain")
            : workspaceRepository.findById(UUID.fromString(workspaceId))
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE)).getDomain();

        String url = domain + path + queryString;

        Api matchingApi = getMatchingApi(workspaceId, method, path);

        ApiResponse http2xxResponse = matchingApi.getResponses() != null
            ? matchingApi.getResponses().stream()
            .filter(response -> response.getCode() >= 200 && response.getCode() < 300)
            .findFirst()
            .orElse(null)
            : null;

        HttpHeaders httpHeaders = new HttpHeaders();
        headers.forEach((key, value) -> {
            if (!"sapi-local-domain".equalsIgnoreCase(key)) {
                httpHeaders.add(key, value);
            }
        });

        ServerRequestInfoDto serverRequestInfoDto = new ServerRequestInfoDto(url, httpHeaders);

        long startTime = System.currentTimeMillis();

        Mono<ResponseEntity<byte[]>> responseEntityMono = proxyService.formDataRequest(serverRequestInfoDto, formParams, files, method);

        return responseEntityMono.map(responseEntity -> toTestResponseDto(responseEntity, httpHeaders, formParams, http2xxResponse, startTime, testType)).block();

    }

    public TestResponseDto testJsonRequest(String workspaceId, Map<String, String> headers, HttpMethod method, Map<String, Object> body, HttpServletRequest request) {
        String path = request.getRequestURI().replace("/api/workspace/" + workspaceId + "/test", "");
        String queryString = request.getQueryString() == null ? "" : "?" + request.getQueryString();
        String testType = headers.containsKey("sapi-local-domain") ? "Local" : "Server";
        String domain = testType.equals("Local")
            ? headers.get("sapi-local-domain")
            : workspaceRepository.findById(UUID.fromString(workspaceId))
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE)).getDomain();

        String url = domain + path + queryString;

        Api matchingApi = getMatchingApi(workspaceId, method, path);

        ApiResponse http2xxResponse = matchingApi.getResponses() != null
            ? matchingApi.getResponses().stream()
            .filter(response -> response.getCode() >= 200 && response.getCode() < 300)
            .findFirst()
            .orElse(null)
            : null;

        HttpHeaders httpHeaders = new HttpHeaders();
        headers.forEach((key, value) -> {
            if (!"sapi-local-domain".equalsIgnoreCase(key)) {
                httpHeaders.add(key, value);
            }
        });

        ServerRequestInfoDto serverRequestInfoDto = new ServerRequestInfoDto(url, httpHeaders);

        long startTime = System.currentTimeMillis();

        Mono<ResponseEntity<byte[]>> responseEntityMono = proxyService.jsonRequest(serverRequestInfoDto, body, method);

        return responseEntityMono.map(responseEntity -> toTestResponseDto(responseEntity, httpHeaders, body, http2xxResponse, startTime, testType)).block();
    }

    private Api getMatchingApi(String workspaceId, HttpMethod method, String path) {
        List<Specification> specifications = specificationRepository.findSpecificationsByWorkspaceId(UUID.fromString(workspaceId));

        List<UUID> apiIds = specifications.stream()
            .filter(specification -> !specification.getConfirmedApiId().equals(""))
            .map(Specification::getConfirmedApiId)
            .toList();

        List<Api> apiList = apiRepository.findAllById(apiIds);

        return apiList.stream()
            .filter(api -> api.getMethod().getValue().equals(method.name()) && pathMatches(api.getPath(), path))
            .findFirst()
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
    }

    private boolean pathMatches(String path, String requestedPath) {
        String regex = path.replaceAll("\\{[^/]+\\}", "[^/]+");
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(requestedPath);

        return matcher.matches();
    }

    private TestResponseDto toTestResponseDto(ResponseEntity<byte[]> responseEntity, HttpHeaders httpHeaders, Map<String, Object> requestBody, ApiResponse mockResponse, long startTime, String testType) {
        long responseTime = System.currentTimeMillis() - startTime;

        // 응답 헤더 및 바디 크기 계산
        long responseHeaderSize = responseEntity.getHeaders().toString().getBytes().length;
        long responseBodySize = responseEntity.getBody() != null ? responseEntity.getBody().length : 0;

        // 요청 헤더 및 바디 크기 계산
        long requestHeaderSize = httpHeaders.toString().getBytes().length;
        long requestBodySize = requestBody.toString().getBytes().length;

        Map<String, String> cookies = responseEntity.getHeaders().get("Set-Cookie") != null
            ? Map.of("Set-Cookie", String.join("; ", responseEntity.getHeaders().get("Set-Cookie")))
            : Map.of();

        // 응답 바디와 목 바디를 비교하여 구조 차이 찾기
        String responseBodyStr = responseEntity.getBody() != null ? new String(responseEntity.getBody()) : null;
        Map<String, Object> responseBodyMap = parseJsonToMap(responseBodyStr);
        Map<String, Object> mockBodyMap = parseJsonToMap(mockResponse.getBodyData());

        List<String> differences = findStructureDifferences(mockBodyMap, responseBodyMap, "");
        String status;
        int code;
        String message;

        if (differences.isEmpty()) {
            status = "success";
            code = responseEntity.getStatusCodeValue();
            message = null;
        } else {
            status = "fail";
            code = 422; // 422 Unprocessable Entity (구조 불일치 시 사용)
            message = String.join("; ", differences);
        }


        return new TestResponseDto(
            status,
            code,
            responseBodyStr,
            mockResponse.getBodyData(),
            responseEntity.getHeaders().toSingleValueMap(),
            cookies,
            Map.of(
                "Headers", requestHeaderSize + " B",
                "Body", requestBodySize + " B"
            ),
            Map.of(
                "Headers", responseHeaderSize + " B",
                "Body", responseBodySize + " B"
            ),
            responseTime,
            testType,
            message
        );

    }

    private static Map<String, Object> parseJsonToMap(String json) {
        if (json == null || json.isEmpty()) {
            return new HashMap<>();
        }
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON to Map", e);
        }
    }

    private static List<String> findStructureDifferences(Map<String, Object> currentObj, Map<String, Object> actualObj, String path) {
        List<String> differences = new ArrayList<>();

        // 두 객체가 null일 경우 차이 없음
        if ((currentObj == null || actualObj == null) && currentObj == actualObj) {
            return differences;
        }

        // currentObj가 null이거나 undefined일 경우
        if (currentObj == null) {
            differences.add("필수 필드 '" + path + "'가 null 또는 undefined 입니다.");
            return differences;
        }

        // actualObj가 null이거나 undefined일 경우
        if (actualObj == null) {
            differences.add("입력받은 필드 '" + path + "'가 null 또는 undefined 입니다.");
            return differences;
        }

        var currentKeys = currentObj.keySet();
        var actualKeys = actualObj.keySet();

        // actualObj에 있는 키들이 currentObj에 있는지 검사
        for (String key : actualKeys) {
            String currentObjPath = path.isEmpty() ? key : path + "." + key;
            if (!currentObj.containsKey(key)) {
                differences.add("필수 필드 '" + currentObjPath + "'가 누락되었습니다.");
                continue;
            }
            if (currentObj.get(key) instanceof Map && actualObj.get(key) instanceof Map) {
                // Map 타입인 경우 재귀적으로 비교
                differences.addAll(findStructureDifferences(
                    (Map<String, Object>) currentObj.get(key),
                    (Map<String, Object>) actualObj.get(key),
                    currentObjPath
                ));
            } else if (!currentObj.get(key).getClass().equals(actualObj.get(key).getClass())) {
                differences.add("'" + currentObjPath + "' 필드는 " + actualObj.get(key).getClass().getSimpleName() +
                    " 타입이어야 하지만, " + currentObj.get(key).getClass().getSimpleName() + " 타입이 입력되었습니다.");
            }
        }

        for (String key : currentKeys) {
            String currentObjPath = path.isEmpty() ? key : path + "." + key;
            if (!actualObj.containsKey(key)) {
                differences.add("허용되지 않는 추가 필드 '" + currentObjPath + "'가 있습니다.");
            }
        }

        return differences;
    }
}
