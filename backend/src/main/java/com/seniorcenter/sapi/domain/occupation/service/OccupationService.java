package com.seniorcenter.sapi.domain.occupation.service;

import com.seniorcenter.sapi.domain.api.presentation.dto.request.AddRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.request.RemoveRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiIdResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.api.util.KeyValueUtils;
import com.seniorcenter.sapi.domain.occupation.presentation.dto.OccupationResponseDto;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.global.utils.RedisUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OccupationService {

    private final RedisUtil redisUtil;
    private final KeyValueUtils keyValueUtils;

    public List<OccupationResponseDto> getOccupations(UUID workspaceId) {
        String hashKey = workspaceId.toString();
        Map<String, Object> datas = redisUtil.getAllData(hashKey);

        List<OccupationResponseDto> occupationList = new ArrayList<>();
        for (Map.Entry<String, Object> entry : datas.entrySet()) {
            occupationList.add(new OccupationResponseDto(entry.getKey(), Long.parseLong(entry.getValue().toString())));
        }
        return occupationList;
    }

    public OccupationResponseDto createOccupaction(UUID workspaceId, ApiMessage message, User user) {
        String hashKey = workspaceId.toString();

        AddRequestDto addRequestDto = keyValueUtils.createById(message);
        redisUtil.saveData(hashKey, addRequestDto.id(), user.getId().toString());
        return new OccupationResponseDto(addRequestDto.id(), user.getId());
    }

    public ApiIdResponseDto removeOccupaction(UUID workspaceId, ApiMessage message) {
        String hashKey = workspaceId.toString();
        RemoveRequestDto removeRequestDto = keyValueUtils.remove(message);
        redisUtil.deleteData(hashKey, removeRequestDto.id().toString());
        return new ApiIdResponseDto(removeRequestDto.id());
    }

}
