package com.seniorcenter.sapi.domain.api.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AttributeType {
    KEY("KEY"),
    VALUE("VALUE"),
    DESCRIPTION("DESCRIPTION");

    private String value;
}
