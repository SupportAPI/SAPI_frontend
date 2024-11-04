package com.seniorcenter.sapi.domain.specification.presentation;

import com.seniorcenter.sapi.domain.specification.domain.MessageType;
import com.seniorcenter.sapi.domain.specification.domain.SpecificationMessage;
import com.seniorcenter.sapi.domain.specification.service.SpecificationService;
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
public class SpecificationMessageController {

    private final SpecificationService specificationService;

    @MessageMapping("workspace/{worksapceId}/specification")
    public void message(@DestinationVariable UUID worksapceId,
                        @Payload SpecificationMessage message) {
        if (message.type().equals(MessageType.WRITE)) {
            log.info("[DOCS ADD] message: {}", message);
            specificationService.sendOriginMessageToAll(message, worksapceId);
        } else if (message.type().equals(MessageType.DELETE)) {
            log.info("[DOCS DELETE] message: {}", message);
            specificationService.removeSpecification(message, worksapceId);
        } else if (message.type().equals(MessageType.ADD)) {
            log.info("[DOCS UPDATE] message: {}", message);
            specificationService.createSpecification(message, worksapceId);
        }
    }
}
