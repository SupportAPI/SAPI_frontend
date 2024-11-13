package com.seniorcenter.sapi.domain.api.service;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.ApiBody;
import com.seniorcenter.sapi.domain.api.domain.enums.ParameterType;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiBodyRepository;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiIdResponseDto;
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
public class ApiBodyService {

    private final ApiRepository apiRepository;
    private final ApiBodyRepository apiBodyRepository;

    public ApiIdResponseDto createApiBody(UUID apiId) {
        Api api = apiRepository.findById(apiId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));

        ApiBody body = ApiBody.createApiBody(api, ParameterType.JSON);
        apiBodyRepository.save(body);
        return new ApiIdResponseDto(body.getId());
    }

//    public ApiIdResponseDto removeApiBody(ApiMessage message, UUID apiId) {
//        Api api = apiRepository.findById(apiId)
//                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_API));
//
//        //RemoveRequestDto removeRequestDto = keyValueUtils.remove(message);
////        ApiBody body = apiBodyRepository.findById(removeRequestDto.id())
////                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_HEADER));
////        apiBodyRepository.delete(body);
////        return new ApiIdResponseDto(body.getId());
//    }
}
