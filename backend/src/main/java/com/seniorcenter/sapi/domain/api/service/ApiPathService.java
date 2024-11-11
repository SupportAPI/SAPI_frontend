package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.enums.HttpMethod;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.IdKeyValueRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateKeyValueRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiKeyValueResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.api.util.KeyValueUtils;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApiPathService {

    private final ApiRepository apiRepository;
    private final KeyValueUtils keyValueUtils;

    public ApiKeyValueResponseDto updateApiPath(ApiMessage message, UUID apiId){
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        UpdateKeyValueRequestDto updateIdKeyValueRequestDto = keyValueUtils.updateKeyValue(message);
        return new ApiKeyValueResponseDto(updateIdKeyValueRequestDto.type(), updateIdKeyValueRequestDto.value());
    }

    public void updateDbApiPath(ApiMessage message, UUID apiId){
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        IdKeyValueRequestDto idKeyValueRequestDto = keyValueUtils.translateToIdKeyValueRequestDto(message);
        api.updatePath(HttpMethod.valueOf(idKeyValueRequestDto.key()),idKeyValueRequestDto.value());
    }

}
