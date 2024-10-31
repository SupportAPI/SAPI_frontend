package com.seniorcenter.sapi.domain.api.presentation;

import com.seniorcenter.sapi.domain.api.domain.ApiMessageType;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.api.service.ApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@RequiredArgsConstructor
@Controller
public class ApiMessageController {

    private final ApiService apiService;

    @MessageMapping("/api/message")
    public void message(ApiMessage message) {

        if (message.messageType().equals(ApiMessageType.WRITE)) {
            apiService.sendOriginMessageToAll(message);
        } else if (message.messageType().equals(ApiMessageType.ADD)) {
            apiService.createApi(message);
        } else if (message.messageType().equals(ApiMessageType.DELETE)) {
            apiService.removeApi(message);
        }
    }
}
