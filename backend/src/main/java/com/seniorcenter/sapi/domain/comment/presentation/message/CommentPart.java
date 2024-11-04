package com.seniorcenter.sapi.domain.comment.presentation.message;

import com.seniorcenter.sapi.domain.comment.domain.CommentType;

public record CommentPart(
        CommentType type,
        String value
) {
}
