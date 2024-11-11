package com.seniorcenter.sapi.domain.proxy.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.specification.domain.Specification;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import software.amazon.awssdk.regions.Region;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProxyServiceImpl implements ProxyService {

    private final WorkspaceRepository workspaceRepository;
    @Value("${cloud.aws.lambda.region}")
    private Region region;

    private final WebClient webClient;
    private final ApiRepository apiRepository;
    private final SpecificationRepository specificationRepository;


    // Mock 서버 정보 가져오기
    @Override
    public ServerRequestInfoDto getMockServerInfo(String workspaceId, HttpServletRequest request, Map<String, String> headers) {
        String path = request.getRequestURI().replace("/proxy/" + workspaceId + "/mock", "");
        String queryString = request.getQueryString() == null ? "" : "?" + request.getQueryString();

        List<Specification> specifications = specificationRepository.findSpecificationsByWorkspaceId(UUID.fromString(workspaceId));
        List<UUID> apiIds = specifications.stream()
                .filter(specification -> !specification.getConfirmedApiId().equals(""))
                .map(Specification::getConfirmedApiId)
                .toList();

        List<Api> apiList = apiRepository.findAllById(apiIds);

        Api matchingApi = apiList.stream()
                .filter(api -> api.getMethod().getValue().equals(request.getMethod()) && pathMatches(api.getPath(), path))
                .findFirst()
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));

        String url = String.format("https://%s.execute-api.%s.amazonaws.com%s", matchingApi.getSpecification().getApiGatewayId(), region.id(), queryString);


        Set<String> excludeHeaders = Set.of(
                "host",
                "connection",
                "content-length",
                "accept-encoding"
        );

        HttpHeaders httpHeaders = new HttpHeaders();
        if (headers != null) {
            headers.forEach((key, value) -> {
                if (!excludeHeaders.contains(key.toLowerCase())) {
                    httpHeaders.add(key, value);
                }
            });
        }

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                headers.put("cookies", cookie.getName() + "=" + cookie.getValue());
            }
        }


        return new ServerRequestInfoDto(url, httpHeaders);
    }

    @Override
    public ServerRequestInfoDto getUserServerInfo(String workspaceId, HttpServletRequest request, Map<String, String> headers) {

        String path = request.getRequestURI().replace("/proxy/" + workspaceId + "/user", "");
        String queryString = request.getQueryString() == null ? "" : "?" + request.getQueryString();

        String domain = headers.containsKey("sapi-local-domain")
                ? headers.get("sapi-local-domain")
                : workspaceRepository.findById(UUID.fromString(workspaceId))
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE)).getDomain();

        String url = domain + path + queryString;

        HttpHeaders httpHeaders = new HttpHeaders();
        headers.forEach((key, value) -> {
            if (!"sapi-local-domain".contains(key.toLowerCase())) {
                httpHeaders.add(key, value);
            }
        });
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                headers.put("cookies", cookie.getName() + "=" + cookie.getValue());
            }
        }

        return new ServerRequestInfoDto(url, httpHeaders);
    }


    public Mono<ResponseEntity<byte[]>> formDataRequest(ServerRequestInfoDto serverRequestInfoDto, Map<String, Object> formParams, Map<String, MultipartFile> files, HttpMethod method) {

        MultipartBodyBuilder multipartBodyBuilder = new MultipartBodyBuilder();

        for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
            String fileName = entry.getKey();
            MultipartFile file = entry.getValue();
            try {
                ByteArrayResource byteArrayResource = new ByteArrayResource(file.getBytes()) {
                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename();
                    }
                };
                multipartBodyBuilder.part(fileName, byteArrayResource)
                        .header("Content-Disposition", "form-data; name=\"" + fileName + "\"; filename=\"" + file.getOriginalFilename() + "\"");
            } catch (IOException e) {
                throw new RuntimeException("Failed to read file bytes", e);
            }
        }

        if (formParams != null) {
            formParams.forEach(multipartBodyBuilder::part);
        }

        // WebClient를 사용하여 요청 전송
        return webClient
                .method(method)
                .uri(serverRequestInfoDto.url())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .headers(h -> h.addAll(serverRequestInfoDto.headers()))
                .body(BodyInserters.fromMultipartData(multipartBodyBuilder.build()))
                .retrieve()
                .toEntity(byte[].class);

    }

    @Override
    public Mono<ResponseEntity<byte[]>> jsonRequest(ServerRequestInfoDto serverRequestInfoDto, Map<String, Object> body, HttpMethod method) {

        return webClient
                .method(method)
                .uri(serverRequestInfoDto.url())
                .contentType(MediaType.APPLICATION_JSON)
                .headers(h -> h.addAll(serverRequestInfoDto.headers()))
                .bodyValue(body != null ? body : Map.of())
                .retrieve()
                .toEntity(byte[].class);
    }

    private boolean pathMatches(String path, String requestedPath) {
        String regex = path.replaceAll("\\{[^/]+\\}", "[^/]+");
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(requestedPath);

        return matcher.matches();
    }
}
