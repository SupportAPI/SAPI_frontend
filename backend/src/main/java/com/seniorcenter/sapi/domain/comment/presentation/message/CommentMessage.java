package com.seniorcenter.sapi.domain.comment.presentation.message;

import com.seniorcenter.sapi.global.type.MessageType;

public record CommentMessage(
        MessageType type,
        Object message
) {
}
