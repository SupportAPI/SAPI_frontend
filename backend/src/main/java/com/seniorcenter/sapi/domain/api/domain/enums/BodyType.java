package com.seniorcenter.sapi.domain.api.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BodyType {
    NONE("NONE"),
    FORM_DATA("FORM_DATA"),
    JSON("JSON"),
    RAW("RAW");

    private String value;
}
