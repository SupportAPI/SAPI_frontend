package com.seniorcenter.sapi.domain.comment.presentation;

import com.seniorcenter.sapi.domain.comment.presentation.message.CommentMessage;
import com.seniorcenter.sapi.domain.comment.service.CommentService;
import com.seniorcenter.sapi.global.type.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Controller
public class CommentMessageController {

    private final CommentService commentService;

    @MessageMapping("/docs/{docId}/comments")
    public void message(@DestinationVariable UUID docId,
                        @Payload CommentMessage message,
                        @AuthenticationPrincipal Principal principal) {
        if (message.type().equals(MessageType.ADD)) {
            log.info("[COMMENT ADD] message: {}, sender: {}", message, principal.getName());
            commentService.createAndSendComment(message, docId, principal);
        } else if (message.type().equals(MessageType.DELETE)) {
            log.info("[COMMENT DELETE] message: {}, sender: {}", message, principal.getName());
            commentService.deleteComment(message, docId, principal);
        } else if (message.type().equals(MessageType.UPDATE)) {
            log.info("[COMMENT UPDATE] message: {}, sender: {}", message, principal.getName());
            commentService.updateComment(message, docId, principal);
        }
    }
}
