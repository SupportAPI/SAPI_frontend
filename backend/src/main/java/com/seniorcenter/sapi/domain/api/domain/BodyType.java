package com.seniorcenter.sapi.domain.api.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BodyType {
    NONE("NONE"),
    FORM_DATA("FORM_DATA"),
    RAW("RAW");

    private String value;
}
