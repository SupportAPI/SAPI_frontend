package com.seniorcenter.sapi.domain.api.presentation.message;

import com.seniorcenter.sapi.domain.api.domain.ApiType;
import com.seniorcenter.sapi.global.type.MessageType;

public record ApiMessage(
        ApiType apiType,
        MessageType actionType,
        Object message
) {
}
