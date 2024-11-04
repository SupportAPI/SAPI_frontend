package com.seniorcenter.sapi.domain.comment.presentation.dto.response;

import com.seniorcenter.sapi.domain.user.domain.User;

public record CommentUserResponseDto(
        Long userId,
        String nickname,
        String profileImage
) {
    public CommentUserResponseDto(User user){
        this(user.getId(),user.getNickname(),user.getProfileImage());
    }
}
