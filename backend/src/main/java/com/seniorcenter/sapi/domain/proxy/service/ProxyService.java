package com.seniorcenter.sapi.domain.proxy.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.util.Map;

public interface ProxyService {
    ServerRequestInfoDto getMockServerInfo(String workspaceId, HttpServletRequest request, Map<String, String> headers);

    ServerRequestInfoDto getUserServerInfo(String workspaceId, HttpServletRequest request, Map<String, String> headers);

    Mono<ResponseEntity<byte[]>> formDataRequest(ServerRequestInfoDto serverRequestInfoDto, Map<String, Object> formParams, Map<String, MultipartFile> files, HttpMethod method);

    Mono<ResponseEntity<byte[]>> jsonRequest(ServerRequestInfoDto serverRequestInfoDto, Map<String, Object> body, HttpMethod method);


}
