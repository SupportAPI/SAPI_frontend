package com.seniorcenter.sapi.domain.api.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AuthenticationType {
    NOAUTH("NOAUTH"),
    BEARER("BEARER"),
    BASIC("BASIC");

    private final String value;
}
