package com.seniorcenter.sapi.domain.comment.presentation;

import com.seniorcenter.sapi.domain.comment.presentation.message.CommentMessage;
import com.seniorcenter.sapi.domain.comment.service.CommentService;
import com.seniorcenter.sapi.global.type.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Controller
public class CommentMessageController {

    private final CommentService commentService;

    @MessageMapping("/docs/{docId}/comments")
    public void message(@DestinationVariable UUID docId,
                        @Payload CommentMessage message) {
        if (message.type().equals(MessageType.ADD)) {
            log.info("[COMMENT ADD] message: {}", message);
            commentService.createAndSendComment(message, docId);
        } else if (message.type().equals(MessageType.DELETE)) {
            log.info("[COMMENT DELETE] message: {}", message);
            commentService.deleteComment(message);
        } else if (message.type().equals(MessageType.UPDATE)) {
            log.info("[COMMENT UPDATE] message: {}", message);
            commentService.updateComment(message);
        }
    }
}
