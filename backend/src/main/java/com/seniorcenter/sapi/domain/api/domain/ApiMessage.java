package com.seniorcenter.sapi.domain.api.domain;

import java.util.UUID;

public record ApiMessage(
        ApiMessageType type,
        UUID workspaceUUID,
        UUID apiUUID,
        Long senderId,
        String messasge
) {
}
