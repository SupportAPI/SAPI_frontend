package com.seniorcenter.sapi.domain.specification.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record SpecificationHistoryListResponseDto(
        String userNickname,
        UUID apiId,
        LocalDateTime createdDate
) {
}
