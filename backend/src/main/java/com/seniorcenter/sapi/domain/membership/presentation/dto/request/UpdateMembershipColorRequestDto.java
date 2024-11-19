package com.seniorcenter.sapi.domain.membership.presentation.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateMembershipColorRequestDto(
        @NotNull String color
) {
}
