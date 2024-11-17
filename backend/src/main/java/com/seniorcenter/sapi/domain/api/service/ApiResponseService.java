package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiResponse;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiResponseRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.IdCodeDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.SaveDataRequestDto;
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
public class ApiResponseService {

    private final ApiRepository apiRepository;
    private final KeyValueUtils keyValueUtils;
    private final ApiResponseRepository apiResponseRepository;

    public IdCodeDto createApiResponse(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        ApiResponse apiResponse = ApiResponse.createApiResponse(api, Integer.parseInt(data.value()));
        apiResponseRepository.save(apiResponse);
        return new IdCodeDto(String.valueOf(apiResponse.getId()), data.value());
    }

    public void removeApiResponse(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        ApiResponse apiResponse = apiResponseRepository.findById(Long.valueOf(data.id()))
                        .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API_RESPONSE));
        apiResponseRepository.delete(apiResponse);
    }

    public SaveDataRequestDto updateApiResponse(ApiMessage message, UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        SaveDataRequestDto data = keyValueUtils.translateToSaveDataRequestDto(message);
        ApiResponse apiResponse = apiResponseRepository.findById(Long.valueOf(data.id()))
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API_RESPONSE));

        if (data.key().equals("NAME")) {
            apiResponse.updateName(data.value());
        } else if (data.key().equals("DATA")) {
            apiResponse.updateBodyTypeAndBodyData(data.type(), data.value());
        }
        return data;
    }
}
