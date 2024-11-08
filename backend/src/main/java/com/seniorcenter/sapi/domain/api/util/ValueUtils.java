package com.seniorcenter.sapi.domain.api.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.RemoveRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateIdValueRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateValueRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ValueUtils {

    private final ObjectMapper objectMapper;

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

    public UpdateIdValueRequestDto update(ApiMessage message) {
        UpdateIdValueRequestDto updateKeyValueRequestDto;
        try {
            updateKeyValueRequestDto = objectMapper.convertValue(message.message(), new TypeReference<UpdateIdValueRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return updateKeyValueRequestDto;
    }

    public UpdateValueRequestDto updateByValue(ApiMessage message) {
        UpdateValueRequestDto updateValueRequestDto;
        try {
            updateValueRequestDto = objectMapper.convertValue(message.message(), new TypeReference<UpdateValueRequestDto>() {
            });
        } catch (IllegalArgumentException e) {
            throw new MainException(CustomException.INVALID_FORMAT);
        }
        return updateValueRequestDto;
    }
}
