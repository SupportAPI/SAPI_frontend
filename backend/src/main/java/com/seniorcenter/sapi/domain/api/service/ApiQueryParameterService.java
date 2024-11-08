package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiQueryParameter;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiQueryParameterRepository;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.RemoveRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.UpdateIdKeyValueRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiIdResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiIdKeyValueResponseDto;
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
public class ApiQueryParameterService {

    private final ApiRepository apiRepository;
    private final ApiQueryParameterRepository apiQueryParameterRepository;
    private final KeyValueUtils keyValueUtils;

    public ApiIdResponseDto createApiQueryParameter(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        ApiQueryParameter apiQueryParameter = ApiQueryParameter.createApiQueryParameter(api);
        apiQueryParameterRepository.save(apiQueryParameter);
        return new ApiIdResponseDto(apiQueryParameter.getId());
    }

    public ApiIdResponseDto removeApiQueryParameter(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        RemoveRequestDto removeRequestDto = keyValueUtils.remove(message);
        ApiQueryParameter apiQueryParameter = apiQueryParameterRepository.findById(removeRequestDto.id())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_QUERY_PARAMETER));
        apiQueryParameterRepository.delete(apiQueryParameter);
        return new ApiIdResponseDto(apiQueryParameter.getId());
    }

    public ApiIdKeyValueResponseDto updateApiQueryParameter(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        UpdateIdKeyValueRequestDto updateIdKeyValueRequestDto = keyValueUtils.update(message);
        ApiQueryParameter apiQueryParameter = apiQueryParameterRepository.findById(updateIdKeyValueRequestDto.id())
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_QUERY_PARAMETER));
        return new ApiIdKeyValueResponseDto(apiQueryParameter.getId(), updateIdKeyValueRequestDto.type(), updateIdKeyValueRequestDto.value());
    }
}
