package com.seniorcenter.sapi.domain.proxy.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

public interface ProxyService {
    ServerRequestInfoDto getMockServerInfo(UUID workspaceId, HttpServletRequest request, Map<String, String> headers);

    ServerRequestInfoDto getUserServerInfo(UUID workspaceId, HttpServletRequest request, Map<String, String> headers);

    ServerRequestInfoDto getDynamicRequestInfo(UUID workspaceId, HttpServletRequest request, Map<String, String> headers);

    Mono<ResponseEntity<byte[]>> formDataRequest(ServerRequestInfoDto serverRequestInfoDto, Map<String, Object> formParams, Map<String, MultipartFile> files, HttpMethod method);

    Mono<ResponseEntity<byte[]>> jsonRequest(ServerRequestInfoDto serverRequestInfoDto, Map<String, Object> body, HttpMethod method);

}
