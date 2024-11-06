package com.seniorcenter.sapi.domain.specification.domain;

import com.seniorcenter.sapi.global.type.MessageType;

public record SpecificationMessage(
        MessageType type,
        Object message
) {
}
