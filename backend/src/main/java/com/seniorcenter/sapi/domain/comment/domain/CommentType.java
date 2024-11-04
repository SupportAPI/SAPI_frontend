package com.seniorcenter.sapi.domain.comment.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CommentType {
    USER("사용자"),
    TEXT("문자");

    private final String value;
}
