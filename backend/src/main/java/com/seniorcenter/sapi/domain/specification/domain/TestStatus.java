package com.seniorcenter.sapi.domain.specification.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TestStatus {
    PENDING("보류"),
    SUCCESS("성공"),
    FAIL("실패");

    private final String value;
}
