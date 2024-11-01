package com.seniorcenter.sapi.domain.specification.domain;

import java.util.UUID;

public record SpecificationMessage(
        MessageType type,
        UUID workspaceUUID,
        UUID specificationUUID,
        Long senderId,
        String message
) {
}
