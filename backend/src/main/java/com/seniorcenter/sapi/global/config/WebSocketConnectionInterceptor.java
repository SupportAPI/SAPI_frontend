package com.seniorcenter.sapi.global.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class WebSocketConnectionInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null) {
            if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                log.info("WebSocket 연결됨: 세션 ID = {}", accessor.getSessionId());
            }
            else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                log.info("WebSocket 연결 해제: 세션 ID = {}", accessor.getSessionId());
            }
        }
        return message;
    }
}
