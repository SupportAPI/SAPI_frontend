package com.seniorcenter.sapi.domain.occupation.service;

import com.seniorcenter.sapi.domain.api.presentation.dto.request.AddRequestDto;
import com.seniorcenter.sapi.domain.api.presentation.dto.response.ApiStringResponseDto;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.api.util.KeyValueUtils;
import com.seniorcenter.sapi.domain.membership.domain.Membership;
import com.seniorcenter.sapi.domain.membership.domain.repository.MembershipRepository;
import com.seniorcenter.sapi.domain.occupation.presentation.dto.OccupationResponseDto;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.RedisUtil;
import com.seniorcenter.sapi.global.utils.user.UserUtils;
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
    private final UserUtils userUtils;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;

    public List<OccupationResponseDto> getOccupations(UUID workspaceId) {
        String hashKey = workspaceId.toString();
        Map<String, Object> datas = redisUtil.getAllData(hashKey);

        User user = userUtils.getUserFromSecurityContext();

        List<OccupationResponseDto> occupationList = new ArrayList<>();
        for (Map.Entry<String, Object> entry : datas.entrySet()) {
            Long userId = Long.parseLong(entry.getValue().toString());

            User occupationUser = userRepository.findById(userId)
                    .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
            Membership occupationMembership = membershipRepository.findByUserIdAndWorkspaceId(userId, workspaceId)
                    .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
            occupationList.add(new OccupationResponseDto(entry.getKey(), userId,
                    occupationUser.getNickname(), occupationUser.getProfileImage(), occupationMembership.getColor().getColor()));
        }
        return occupationList;
    }

    public OccupationResponseDto createOccupaction(UUID workspaceId, ApiMessage message, User user) {
        String hashKey = workspaceId.toString();

        Membership membership = membershipRepository.findByUserIdAndWorkspaceId(user.getId(), workspaceId)
                .orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));

        AddRequestDto addRequestDto = keyValueUtils.createById(message);
        redisUtil.saveData(hashKey, addRequestDto.id(), user.getId().toString());
        return new OccupationResponseDto(addRequestDto.id(), user.getId(), user.getNickname(), user.getProfileImage(), membership.getColor().getColor());
    }

    public ApiStringResponseDto removeOccupaction(UUID workspaceId, ApiMessage message) {
        String hashKey = workspaceId.toString();
        ApiStringResponseDto removeRequestDto = keyValueUtils.removeAndReturnString(message);
        redisUtil.deleteData(hashKey, removeRequestDto.id().toString());
        return new ApiStringResponseDto(removeRequestDto.id().toString());
    }

}
