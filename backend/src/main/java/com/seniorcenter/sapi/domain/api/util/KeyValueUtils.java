package com.seniorcenter.sapi.domain.api.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.AddRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.RemoveRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateIdKeyValueRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateKeyValueRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiStringResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class KeyValueUtils {

    private final ObjectMapper objectMapper;

    public AddRequestDto createById(ApiMessage message) {
        AddRequestDto removeRequestDto;
        try {
            removeRequestDto = objectMapper.convertValue(message.message(), new TypeReference<AddRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return removeRequestDto;
    }

    public RemoveRequestDto remove(ApiMessage message) {
        RemoveRequestDto removeRequestDto;
        try {
            removeRequestDto = objectMapper.convertValue(message.message(), new TypeReference<RemoveRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return removeRequestDto;
    }

    public ApiStringResponseDto removeAndReturnString(ApiMessage message) {
        ApiStringResponseDto removeRequestDto;
        try {
            removeRequestDto = objectMapper.convertValue(message.message(), new TypeReference<ApiStringResponseDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return removeRequestDto;
    }

    public UpdateIdKeyValueRequestDto update(ApiMessage message) {
        UpdateIdKeyValueRequestDto updateIdKeyValueRequestDto;
        try {
            updateIdKeyValueRequestDto = objectMapper.convertValue(message.message(), new TypeReference<UpdateIdKeyValueRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return updateIdKeyValueRequestDto;
    }

    public UpdateKeyValueRequestDto updateKeyValue(ApiMessage message) {
        UpdateKeyValueRequestDto updateIdKeyValueRequestDto;
        try {
            updateIdKeyValueRequestDto = objectMapper.convertValue(message.message(), new TypeReference<UpdateKeyValueRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return updateIdKeyValueRequestDto;
    }
}
