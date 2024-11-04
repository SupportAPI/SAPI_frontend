package com.seniorcenter.sapi.domain.specification.domain;

public record SpecificationMessage(
        MessageType type,
        String message
) {
}
