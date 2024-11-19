package com.seniorcenter.sapi.domain.occupation.presentation.dto;

public record OccupationResponseDto(
        String componentId,
        Long userId,
        String nickname,
        String profileImage,
        String color
) {
}
