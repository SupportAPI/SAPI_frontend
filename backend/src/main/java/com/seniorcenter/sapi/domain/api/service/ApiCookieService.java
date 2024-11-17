package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiCookie;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiCookieRepository;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.RemoveRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.SaveDataRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateIdKeyValueRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiIdResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiIdKeyValueResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiStringResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.api.util.KeyValueUtils;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.RedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApiCookieService {

    private final ApiCookieRepository apiCookieRepository;
    private final ApiRepository apiRepository;
    private final KeyValueUtils keyValueUtils;
    private final RedisUtil redisUtil;

    public ApiIdResponseDto createApiCookie(UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        ApiCookie apiCookie = ApiCookie.createApiCookie(api);
        apiCookieRepository.save(apiCookie);
        return new ApiIdResponseDto(apiCookie.getId());
    }

    public ApiIdResponseDto removeApiCookie(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        RemoveRequestDto removeRequestDto = keyValueUtils.remove(message);
        ApiCookie apiCookie = apiCookieRepository.findById(removeRequestDto.id())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));
        apiCookieRepository.delete(apiCookie);
        return new ApiIdResponseDto(apiCookie.getId());
    }

    public ApiIdKeyValueResponseDto updateApiCookie(ApiMessage message, UUID apiId, User user) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        UpdateIdKeyValueRequestDto updateIdKeyValueRequestDto = keyValueUtils.update(message);
        ApiCookie apiCookie = apiCookieRepository.findById(updateIdKeyValueRequestDto.id())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUNT_COOKIE));
        return new ApiIdKeyValueResponseDto(apiCookie.getId(), updateIdKeyValueRequestDto.type(), updateIdKeyValueRequestDto.value(), user.getId());
    }

    public void updateDBApiCookie(ApiMessage message, UUID workspaceId) {
        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        ApiCookie apiCookie = apiCookieRepository.findById(Long.valueOf(data.id()))
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));
        apiCookie.updateCookieKeyAndValueAndDescription(data.key(), data.value(), data.description());

        String hashKey = workspaceId.toString();
        log.info("[API COOKIE DB_UPDATE] hashkey = {}, componentId = {}", hashKey, data.componentId());
        redisUtil.deleteData(hashKey, data.componentId());
    }

}
