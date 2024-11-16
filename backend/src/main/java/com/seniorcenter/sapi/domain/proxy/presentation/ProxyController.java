package com.seniorcenter.sapi.domain.proxy.presentation;

import com.seniorcenter.sapi.domain.proxy.service.ProxyService;
import com.seniorcenter.sapi.domain.proxy.service.ServerRequestInfoDto;
import com.seniorcenter.sapi.global.annotation.ExcludeFromAdvice;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@Slf4j
@ExcludeFromAdvice
@RequiredArgsConstructor
@RequestMapping("/proxy/{workspaceId}")
@RestController
public class ProxyController {

    private final ProxyService proxyService;

    @RequestMapping(value = "/mock/**")
    public Mono<ResponseEntity<byte[]>> mockServerDefaultRequest(
            @PathVariable("workspaceId") UUID workspaceId,
            @RequestHeader(required = false) Map<String, String> headers,
            HttpMethod method,
            HttpServletRequest request
    ) {
        ServerRequestInfoDto serverRequestInfoDto = proxyService.getMockServerInfo(workspaceId, request, headers);
        return proxyService.formDataRequest(serverRequestInfoDto, Map.of(), Map.of(), method);
    }

    @RequestMapping(value = "/mock/**", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<byte[]>> mockServerFormRequest(
            @PathVariable("workspaceId") UUID workspaceId,
            @RequestHeader(required = false) Map<String, String> headers,
            @RequestParam Map<String, MultipartFile> files,
            @RequestParam(required = false) Map<String, Object> formParams,
            HttpMethod method,
            HttpServletRequest request
    ) {
        ServerRequestInfoDto serverRequestInfoDto = proxyService.getMockServerInfo(workspaceId, request, headers);
        return proxyService.formDataRequest(serverRequestInfoDto, formParams, files, method);
    }

    @RequestMapping(value = "/mock/**", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<byte[]>> mockServerJsonRequest(
            @PathVariable("workspaceId") UUID workspaceId,
            @RequestHeader(required = false) Map<String, String> headers,
            @RequestBody Map<String, Object> body,
            HttpMethod method,
            HttpServletRequest request
    ) {
        ServerRequestInfoDto serverRequestInfoDto = proxyService.getMockServerInfo(workspaceId, request, headers);
        return proxyService.jsonRequest(serverRequestInfoDto, body, method);
    }

    @RequestMapping(value = "/user/**")
    public Mono<ResponseEntity<byte[]>> userServerDefaultRequest(
            @PathVariable("workspaceId") UUID workspaceId,
            @RequestHeader(required = false) Map<String, String> headers,
            HttpMethod method,
            HttpServletRequest request
    ) {
        ServerRequestInfoDto serverRequestInfoDto = proxyService.getUserServerInfo(workspaceId, request, headers);
        return proxyService.formDataRequest(serverRequestInfoDto, Map.of(), Map.of(), method);
    }

    @RequestMapping(value = "/user/**", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<byte[]>> userServerFormRequest(
            @PathVariable("workspaceId") UUID workspaceId,
            @RequestHeader(required = false) Map<String, String> headers,
            @RequestParam Map<String, MultipartFile> files,
            @RequestParam(required = false) Map<String, Object> formParams,
            HttpMethod method,
            HttpServletRequest request
    ) {
        ServerRequestInfoDto serverRequestInfoDto = proxyService.getUserServerInfo(workspaceId, request, headers);
        Mono<ResponseEntity<byte[]>> responseEntityMono = proxyService.formDataRequest(serverRequestInfoDto, formParams, files, method);
        System.out.println(responseEntityMono);
        return responseEntityMono;
    }

    @RequestMapping(value = "/user/**", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<byte[]>> userServerJsonRequest(
            @PathVariable("workspaceId") UUID workspaceId,
            @RequestHeader(required = false) Map<String, String> headers,
            @RequestBody Map<String, Object> body,
            HttpMethod method,
            HttpServletRequest request
    ) {
        ServerRequestInfoDto serverRequestInfoDto = proxyService.getUserServerInfo(workspaceId, request, headers);
        return proxyService.jsonRequest(serverRequestInfoDto, body, method);
    }


    @RequestMapping(value = "/dynamic/**")
    public Mono<ResponseEntity<byte[]>> dynamicDefaultRequest(
        @PathVariable("workspaceId") UUID workspaceId,
        @RequestHeader(required = false) Map<String, String> headers,
        HttpMethod method,
        HttpServletRequest request
    ) {
        ServerRequestInfoDto serverRequestInfoDto = proxyService.getDynamicRequestInfo(workspaceId, request, headers);
        return proxyService.formDataRequest(serverRequestInfoDto, Map.of(), Map.of(), method);
    }

    @RequestMapping(value = "/dynamic/**", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<byte[]>> dynamicFormRequest(
        @PathVariable("workspaceId") UUID workspaceId,
        @RequestHeader(required = false) Map<String, String> headers,
        @RequestParam Map<String, MultipartFile> files,
        @RequestParam(required = false) Map<String, Object> formParams,
        HttpMethod method,
        HttpServletRequest request
    ) {
        ServerRequestInfoDto serverRequestInfoDto = proxyService.getUserServerInfo(workspaceId, request, headers);
        Mono<ResponseEntity<byte[]>> responseEntityMono = proxyService.formDataRequest(serverRequestInfoDto, formParams, files, method);
        System.out.println(responseEntityMono);
        return responseEntityMono;
    }

    @RequestMapping(value = "/dynamic/**", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<byte[]>> dynamicJsonRequest(
        @PathVariable("workspaceId") UUID workspaceId,
        @RequestHeader(required = false) Map<String, String> headers,
        @RequestBody Map<String, Object> body,
        HttpMethod method,
        HttpServletRequest request
    ) {
        ServerRequestInfoDto serverRequestInfoDto = proxyService.getUserServerInfo(workspaceId, request, headers);
        return proxyService.jsonRequest(serverRequestInfoDto, body, method);
    }
}