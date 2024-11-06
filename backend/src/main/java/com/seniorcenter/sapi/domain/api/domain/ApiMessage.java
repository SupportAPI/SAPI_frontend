package com.seniorcenter.sapi.domain.api.domain;

import com.seniorcenter.sapi.global.type.MessageType;

import java.util.UUID;

public record ApiMessage(
        MessageType type,
        UUID workspaceUUID,
        UUID apiUUID,
        Long senderId,
        String messasge
) {
}
