package com.seniorcenter.sapi.domain.specification.presentation;

import com.seniorcenter.sapi.domain.specification.domain.MessageType;
import com.seniorcenter.sapi.domain.specification.domain.SpecificationMessage;
import com.seniorcenter.sapi.domain.specification.service.SpecificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@RequiredArgsConstructor
@Controller
public class SpecificationMessageController {

    private final SpecificationService specificationService;

    @MessageMapping("/specification/message")
    public void message(SpecificationMessage message) {

        if (message.type().equals(MessageType.WRITE)) {
            specificationService.sendOriginMessageToAll(message);
        } else if (message.type().equals(MessageType.DELETE)) {
            specificationService.removeSpecification(message);
        } else if (message.type().equals(MessageType.ADD)) {
            specificationService.createSpecification(message);
        }

    }
}
