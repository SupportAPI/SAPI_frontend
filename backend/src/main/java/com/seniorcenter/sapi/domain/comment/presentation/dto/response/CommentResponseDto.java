package com.seniorcenter.sapi.domain.comment.presentation.dto.response;

import com.seniorcenter.sapi.domain.comment.domain.CommentType;

import java.time.LocalDateTime;
import java.util.List;

public record CommentResponseDto(
        Long commentId,
        List<CommentPart> comment,
        LocalDateTime createdDate,
        boolean isHost
) {
    public record CommentPart(CommentType type, Object value) {}
}
