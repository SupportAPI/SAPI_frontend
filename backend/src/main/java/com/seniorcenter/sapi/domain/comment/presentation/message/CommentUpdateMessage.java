package com.seniorcenter.sapi.domain.comment.presentation.message;

import java.util.List;

public record CommentUpdateMessage(
        Long commentId,
        List<CommentPart> message
) {
}
