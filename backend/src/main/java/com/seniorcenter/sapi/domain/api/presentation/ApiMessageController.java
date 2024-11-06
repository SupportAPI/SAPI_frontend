package com.seniorcenter.sapi.domain.api.presentation;

import com.seniorcenter.sapi.domain.api.domain.ApiType;
import com.seniorcenter.sapi.domain.api.presentation.message.ApiMessage;
import com.seniorcenter.sapi.domain.api.service.ApiService;
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
public class ApiMessageController {

    private final ApiService apiService;

    @MessageMapping("/workspaces/{worksapceId}/apis/{apiId}")
    public void message(@DestinationVariable UUID workspaceId,
                        @DestinationVariable UUID apiId,
                        @Payload ApiMessage message,
                        @AuthenticationPrincipal Principal principal) {

        if (message.actionType().equals(MessageType.UPDATE)) {
            apiService.updateApi(message, workspaceId, apiId, principal);
        } else if (message.actionType().equals(MessageType.ADD)) {
            apiService.createApi(message, apiId, workspaceId, principal);
        } else if (message.actionType().equals(MessageType.DELETE)) {
            apiService.removeApi(message, workspaceId, apiId, principal);
        }

    }
}
