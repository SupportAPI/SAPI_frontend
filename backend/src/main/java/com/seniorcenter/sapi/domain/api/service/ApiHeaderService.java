package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiHeader;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiHeaderRepository;
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
public class ApiHeaderService {

    private final ApiHeaderRepository apiHeaderRepository;
    private final ApiRepository apiRepository;
    private final KeyValueUtils keyValueUtils;
    private final RedisUtil redisUtil;

    public ApiIdResponseDto createApiHeader(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        ApiHeader apiHeader;
        if(data.key() == null){
            apiHeader = ApiHeader.createApiHeader(api);
        } else {
            apiHeader = ApiHeader.createApiHeader(api,data.key(),data.value(),data.required());
        }
        apiHeaderRepository.save(apiHeader);
        return new ApiIdResponseDto(apiHeader.getId());
    }

    public ApiIdResponseDto removeApiHeader(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        RemoveRequestDto removeRequestDto = keyValueUtils.remove(message);
        ApiHeader apiHeader = apiHeaderRepository.findById(removeRequestDto.id())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_HEADER));
        apiHeaderRepository.delete(apiHeader);
        return new ApiIdResponseDto(apiHeader.getId());
    }

    public ApiIdKeyValueResponseDto updateApiHeader(ApiMessage message, UUID apiId, User user) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        UpdateIdKeyValueRequestDto updateIdKeyValueRequestDto = keyValueUtils.update(message);
        ApiHeader apiHeader = apiHeaderRepository.findById(updateIdKeyValueRequestDto.id())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_HEADER));
        return new ApiIdKeyValueResponseDto(apiHeader.getId(), updateIdKeyValueRequestDto.type(), updateIdKeyValueRequestDto.value(), user.getId());
    }

    public void updateDBApiHeader(ApiMessage message, UUID workspaceId) {
        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        ApiHeader apiHeader = apiHeaderRepository.findById(Long.valueOf(data.id()))
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));
        apiHeader.updateApiHeaderKeyAndValue(data.key(), data.value());

        String hashKey = workspaceId.toString();
        log.info("[API HEADER DB_UPDATE] hashkey = {}, componentId = {}", hashKey, data.componentId());
        redisUtil.deleteData(hashKey, data.componentId());
    }

}
