package com.seniorcenter.sapi.domain.api.presentation.message;

import com.seniorcenter.sapi.domain.api.domain.enums.ApiMessageType;

import java.util.UUID;

public record ApiMessage(
        ApiMessageType messageType,
        UUID workspaceUUID,
        UUID specificationUUID,
        UUID apiUUID,
        Long senderId,
        String message
) {
}
