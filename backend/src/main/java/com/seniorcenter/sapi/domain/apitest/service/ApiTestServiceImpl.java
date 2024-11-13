package com.seniorcenter.sapi.domain.apitest.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seniorcenter.sapi.domain.api.domain.*;
import com.seniorcenter.sapi.domain.api.domain.enums.BodyType;
import com.seniorcenter.sapi.domain.api.domain.enums.ParameterType;
import com.seniorcenter.sapi.domain.api.domain.repository.*;
import com.seniorcenter.sapi.domain.api.presentation.dto.ParametersDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.RequestDto;
import com.seniorcenter.sapi.domain.apifile.domain.ApiFile;
import com.seniorcenter.sapi.domain.apifile.domain.repository.ApiFileRepository;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.TestApiRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.request.UpdateApiDetailRequestDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestDetailResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.ApiTestResponseDto;
import com.seniorcenter.sapi.domain.apitest.presentation.dto.response.TestResponseDto;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.proxy.service.ProxyService;
import com.seniorcenter.sapi.domain.proxy.service.ServerRequestInfoDto;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.TestStatus;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.JsonUtil;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApiTestServiceImpl implements ApiTestService {

    private final ApiRepository apiRepository;
    private final SpecificationRepository specificationRepository;
    private final MembershipRepository membershipRepository;
    private final ApiHeaderRepository apiHeaderRepository;
    private final ApiPathVariableRepository apiPathVariableRepository;
    private final ApiQueryParameterRepository apiQueryParameterRepository;
    private final ApiCookieRepository apiCookieRepository;
    private final ApiBodyRepository apiBodyRepository;
    private final UserUtils userUtils;
    private final WorkspaceRepository workspaceRepository;
    private final ProxyService proxyService;
    private final ApiFileRepository apiFileRepository;

    @Override
    public List<ApiTestResponseDto> getConfirmedApisByWorkspaceId(UUID workspaceId) {
        return apiRepository.findConfirmedApisByWorkspaceId(workspaceId);
    }

    @Override
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
        List<ParametersDto.Header> headers = api.getHeaders().stream()
            .map(header -> {
                return new ParametersDto.Header(
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
        List<ParametersDto.PathVariable> pathVariables = api.getPathVariables().stream()
            .map(queryParameter -> {
                return new ParametersDto.PathVariable(
                    queryParameter.getId().toString(),
                    queryParameter.getVariableKey(),
                    queryParameter.getVariableValue(),
                    queryParameter.getDescription()
                );
            })
            .toList();

        // 쿼리 파라미터 처리
        List<ParametersDto.QueryParameter> queryParameters = api.getQueryParameters().stream()
            .map(queryParameter -> {
                return new ParametersDto.QueryParameter(
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
        List<ParametersDto.Cookie> cookies = api.getCookies().stream()
            .map(cookie -> {
                return new ParametersDto.Cookie(
                    cookie.getId().toString(),
                    cookie.getCookieKey(),
                    cookie.getCookieValue(),
                    cookie.getDescription(),
                    cookie.getIsEssential(),
                    cookie.getIsChecked()
                );
            })
            .toList();

        ParametersDto parameters = new ParametersDto(
            api.getAuthenticationType().name(),
            headers,
            pathVariables,
            queryParameters,
            cookies
        );

        // Body JSON 및 FormData 처리
        RequestDto.JsonData jsonData = api.getBodies().stream()
            .filter(body -> body.getParameterType() == ParameterType.JSON)
            .map(body -> {
                return new RequestDto.JsonData(
                    body.getId().toString(),
                    body.getBodyValue()
                );
            })
            .findFirst()
            .orElse(null);

        List<RequestDto.FormData> formDataList = api.getBodies().stream()
            .filter(body -> body.getParameterType() == ParameterType.TEXT || body.getParameterType() == ParameterType.FILE)
            .map(formData -> {
                RequestDto.FormData.ApiFileDto apiFileDto = null;
                if (formData.getParameterType() == ParameterType.FILE) {
                    apiFileDto = apiFileRepository.findById(Long.parseLong(formData.getBodyValue()))
                        .map(RequestDto.FormData.ApiFileDto::from)
                        .orElse(null);
                }
                return new RequestDto.FormData(
                    formData.getId().toString(),
                    formData.getBodyKey(),
                    formData.getBodyValue(),
                    formData.getParameterType().name(),
                    apiFileDto,
                    formData.getDescription(),
                    formData.getIsEssential(),
                    formData.getIsChecked()
                );
            })
            .toList();

        RequestDto request = new RequestDto(
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
            api.getCategory(),
            specification.getLocalStatus(),
            specification.getServerStatus(),
            managerEmail,
            managerNickname,
            managerProfileImage,
            parameters,
            request
        );
    }

    @Override
    @Transactional
    public void updateTestApi(UUID workspaceId, UUID apiId, UpdateApiDetailRequestDto requestDto) {
        requestDto.parameters().headers().forEach(headerDto -> {
            apiHeaderRepository.findById(Long.parseLong(headerDto.id()))
                .ifPresent(header -> {
                    header.updateApiHeaderValue(headerDto.value(), headerDto.isChecked());
                    apiHeaderRepository.save(header);
                });
        });

        requestDto.parameters().pathVariables().forEach(pathVariableDto -> {
            apiPathVariableRepository.findById(Long.parseLong(pathVariableDto.id()))
                .ifPresent(pathVariable -> {
                    pathVariable.updateApiPathVariableValue(pathVariableDto.value());
                    apiPathVariableRepository.save(pathVariable);
                });
        });

        requestDto.parameters().queryParameters().forEach(queryParameterDto -> {
            apiQueryParameterRepository.findById(Long.parseLong(queryParameterDto.id()))
                .ifPresent(queryParameter -> {
                    queryParameter.updateApiQueryParameterValue(queryParameterDto.value(),
                        queryParameterDto.isChecked());
                    apiQueryParameterRepository.save(queryParameter);
                });
        });

        requestDto.parameters().cookies().forEach(cookieDto -> {
            apiCookieRepository.findById(Long.parseLong(cookieDto.id()))
                .ifPresent(cookie -> {
                    cookie.updateCookieValue(cookieDto.value(), cookieDto.isChecked());
                    apiCookieRepository.save(cookie);
                });
        });

        if (requestDto.request().json() != null) {
            apiBodyRepository.findById(Long.parseLong(requestDto.request().json().id()))
                .ifPresent(body -> {
                    body.updateBodyValue(requestDto.request().json().value(), true);
                    apiBodyRepository.save(body);
                });
        }

        requestDto.request().formData().forEach(formDataDto -> {
            apiBodyRepository.findById(Long.parseLong(formDataDto.id()))
                .ifPresent(body -> {
                    body.updateBodyValue(formDataDto.value(), formDataDto.isChecked());
                    apiBodyRepository.save(body);
                });
        });
    }

    @Override
    public TestResponseDto requestTestApi(UUID workspaceId, TestApiRequestDto requestDto, Map<String, String> headers) {
        User user = userUtils.getUserFromSecurityContext();

        if (membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId).isEmpty()) {
            throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        Specification specification = specificationRepository.findById(requestDto.docId())
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        Api api = apiRepository.findById(specification.getConfirmedApiId())
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        if (!api.getId().equals(requestDto.apiId())) {
            throw new MainException(CustomException.SPECIFICATION_CHANGED);
        }

        String testType = headers.containsKey("sapi-local-domain") ? "Local" : "Server";

        String domain = testType.equals("Local")
            ? headers.get("sapi-local-domain")
            : workspaceRepository.findById(workspaceId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE)).getDomain();

        String path = requestDto.path();
        Map<String, String> variableMap = requestDto.parameters().pathVariables().stream()
            .collect(Collectors.toMap(ParametersDto.PathVariable::key, ParametersDto.PathVariable::value));
        for (Map.Entry<String, String> entry : variableMap.entrySet()) {
            String placeholder = String.format("{%s}", entry.getKey());
            path = path.replace(placeholder, entry.getValue());
        }

        String queryString = requestDto.parameters().queryParameters().isEmpty()
            ? ""
            : "?" + requestDto.parameters().queryParameters().stream()
            .map(param -> param.key() + "=" + param.value())
            .collect(Collectors.joining("&"));

        String url = domain + path + queryString;

        HttpHeaders httpHeaders = new HttpHeaders();
        requestDto.parameters().headers()
            .forEach(header -> httpHeaders.add(header.key(), header.value()));

        ServerRequestInfoDto serverRequestInfoDto = new ServerRequestInfoDto(url, httpHeaders);

        BodyType contentType = api.getBodyType();
        Mono<ResponseEntity<byte[]>> responseEntityMono;
        Map<String, Object> requestBody = new HashMap<>();

        if (contentType.equals(BodyType.FORM_DATA)) {
            Map<String, Object> formParams = new HashMap<>();
            Map<String, MultipartFile> files = new HashMap<>();

            for (RequestDto.FormData formData : requestDto.request().formData()) {
                if ("TEXT".equalsIgnoreCase(formData.type())) {
                    formParams.put(formData.key(), formData.value());
                } else if ("FILE".equalsIgnoreCase(formData.type()) && formData.file() != null) {
                    ApiFile apiFile = apiFileRepository.findById(Long.parseLong(formData.value()))
                        .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_FILE));

                    MultipartFile multipartFile = new MockMultipartFile(
                        apiFile.getFileName(),
                        apiFile.getFileName(),
                        "application/octet-stream",
                        apiFile.getFileData()
                    );

                    files.put(formData.key(), multipartFile);
                }
            }
            responseEntityMono = proxyService.formDataRequest(serverRequestInfoDto, formParams, files, HttpMethod.valueOf(requestDto.method()));
            requestBody = formParams;
        } else if (contentType.equals(BodyType.JSON)) {
            String jsonString = requestDto.request().json().value();
            requestBody = JsonUtil.convertStringToMap(jsonString);
            responseEntityMono = proxyService.jsonRequest(serverRequestInfoDto, requestBody, HttpMethod.valueOf(requestDto.method()));
        } else {
            responseEntityMono = proxyService.jsonRequest(serverRequestInfoDto, requestBody, HttpMethod.valueOf(requestDto.method()));
        }

        // 비동기 응답을 동기적으로 가져오기
        ResponseEntity<byte[]> responseEntity = responseEntityMono.block();

        // mock 응답
        ApiResponse http2xxResponse = api.getResponses() != null
            ? api.getResponses().stream()
            .filter(response -> response.getCode() >= 200 && response.getCode() < 300)
            .findFirst()
            .orElse(null)
            : null;


        // TestResponseDto 변환 및 반환
        long startTime = System.currentTimeMillis();
        return toTestResponseDto(responseEntity, httpHeaders, requestBody, http2xxResponse, startTime, testType);
    }

    @Override
    public TestResponseDto requestTestApiBySpecificationId(UUID workspaceId, UUID specificationId, Map<String, String> headers) {
        User user = userUtils.getUserFromSecurityContext();

        if (membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId).isEmpty()) {
            throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
        }

        Specification specification = specificationRepository.findById(specificationId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        Api api = apiRepository.findById(specification.getConfirmedApiId())
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        String testType = headers.containsKey("sapi-local-domain") ? "Local" : "Server";

        String domain = testType.equals("Local")
            ? headers.get("sapi-local-domain")
            : workspaceRepository.findById(workspaceId)
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE)).getDomain();

        String path = api.getPath();
        Map<String, String> variableMap = apiPathVariableRepository.findAllByApi(api).stream()
            .collect(Collectors.toMap(ApiPathVariable::getVariableKey, ApiPathVariable::getVariableValue));
        for (Map.Entry<String, String> entry : variableMap.entrySet()) {
            String placeholder = String.format("{%s}", entry.getKey());
            path = path.replace(placeholder, entry.getValue());
        }

        List<ApiQueryParameter> queryParameters = apiQueryParameterRepository.findAllByApi(api);
        String queryString = queryParameters.isEmpty()
            ? ""
            : "?" + queryParameters.stream()
            .map(param -> param.getParamKey() + "=" + param.getParamValue())
            .collect(Collectors.joining("&"));

        String url = domain + path + queryString;

        HttpHeaders httpHeaders = new HttpHeaders();
        apiHeaderRepository.findAllByApi(api)
            .forEach(header -> httpHeaders.add(header.getHeaderKey(), header.getHeaderValue()));

        ServerRequestInfoDto serverRequestInfoDto = new ServerRequestInfoDto(url, httpHeaders);


        BodyType contentType = api.getBodyType();
        Mono<ResponseEntity<byte[]>> responseEntityMono;
        Map<String, Object> requestBody = new HashMap<>();

        if (contentType.equals(BodyType.FORM_DATA)) {
            Map<String, Object> formParams = new HashMap<>();
            Map<String, MultipartFile> files = new HashMap<>();

            for (ApiBody body : apiBodyRepository.findAllByApi(api)) {
                if ("TEXT".equalsIgnoreCase(body.getParameterType().getValue())) {
                    formParams.put(body.getBodyKey(), body.getBodyValue());
                } else if ("FILE".equalsIgnoreCase(String.valueOf(body.getParameterType())) && body.getBodyKey() != null) {
                    ApiFile apiFile = apiFileRepository.findById(Long.parseLong(body.getBodyValue()))
                        .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_FILE));

                    MultipartFile multipartFile = new MockMultipartFile(
                        apiFile.getFileName(),
                        apiFile.getFileName(),
                        "application/octet-stream",
                        apiFile.getFileData()
                    );

                    files.put(body.getBodyKey(), multipartFile);
                }
            }
            responseEntityMono = proxyService.formDataRequest(serverRequestInfoDto, formParams, files, HttpMethod.valueOf(api.getMethod().getValue()));
            requestBody = formParams;
        } else if (contentType.equals(BodyType.JSON)) {
            String jsonString = apiBodyRepository.findAllByApi(api).stream()
                .filter(body -> body.getParameterType().equals(ParameterType.JSON))
                .findFirst().get().getBodyValue();
            requestBody = JsonUtil.convertStringToMap(jsonString);
            responseEntityMono = proxyService.jsonRequest(serverRequestInfoDto, requestBody, HttpMethod.valueOf(api.getMethod().getValue()));
        } else {
            responseEntityMono = proxyService.jsonRequest(serverRequestInfoDto, requestBody, HttpMethod.valueOf(api.getMethod().getValue()));
        }

        // 비동기 응답을 동기적으로 가져오기
        ResponseEntity<byte[]> responseEntity = responseEntityMono.block();

        // mock 응답
        ApiResponse http2xxResponse = api.getResponses() != null
            ? api.getResponses().stream()
            .filter(response -> response.getCode() >= 200 && response.getCode() < 300)
            .findFirst()
            .orElse(null)
            : null;


        // TestResponseDto 변환 및 반환
        long startTime = System.currentTimeMillis();
        return toTestResponseDto(responseEntity, httpHeaders, requestBody, http2xxResponse, startTime, testType);
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

        List<String> differences = findStructureDifferences(responseBodyMap, mockBodyMap, "");
        String status;
        int code;
        String message;

        if (differences.isEmpty()) {
            status = TestStatus.SUCCESS.name();
            code = responseEntity.getStatusCodeValue();
            message = null;
        } else {
            status = TestStatus.FAIL.name();
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
