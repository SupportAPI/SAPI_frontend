package com.seniorcenter.sapi.domain.api.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AuthenticationType {
    NOAUTH("NOAUTH"),
    BEARER("BEARER");

    private final String value;
}
