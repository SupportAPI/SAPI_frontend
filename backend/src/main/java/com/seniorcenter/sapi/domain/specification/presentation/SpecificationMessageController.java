package com.seniorcenter.sapi.domain.specification.presentation;

import com.seniorcenter.sapi.domain.specification.domain.SpecificationMessage;
import com.seniorcenter.sapi.domain.specification.service.SpecificationService;
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
public class SpecificationMessageController {

    private final SpecificationService specificationService;

    @MessageMapping("/workspaces/{worksapceId}/docs")
    public void message(@DestinationVariable UUID worksapceId,
                        @Payload SpecificationMessage message,
                        @AuthenticationPrincipal Principal principal) {
        if (message.type().equals(MessageType.ADD)) {
            log.info("[DOCS ADD] message: {}", message);
            specificationService.createSpecification(message, worksapceId, principal);
        } else if (message.type().equals(MessageType.DELETE)) {
            log.info("[DOCS DELETE] message: {}", message);
            specificationService.removeSpecification(message, worksapceId, principal);
        } else if (message.type().equals(MessageType.UPDATE)){
            log.info("[DOCS UPDATE] message: {}", message);
            specificationService.updateSpecification(message, worksapceId, principal);
        }
    }
}
