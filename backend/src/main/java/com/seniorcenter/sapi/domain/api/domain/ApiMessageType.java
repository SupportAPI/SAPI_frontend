package com.seniorcenter.sapi.domain.api.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ApiMessageType {
    ENTER("입장"), 
    JOIN("참가"), 
    WRITE("작성"), 
    ADD("추가"), 
    DELETE("삭제"),
    ERROR("에러");

    private final String value;
}
