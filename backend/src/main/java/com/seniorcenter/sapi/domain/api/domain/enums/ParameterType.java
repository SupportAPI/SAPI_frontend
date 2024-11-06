package com.seniorcenter.sapi.domain.api.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ParameterType {
    TEXT("TEXT"),
    FILE("FILE"),
    JSON("JSON");

    private String value;
}
