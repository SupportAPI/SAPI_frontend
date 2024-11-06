package com.seniorcenter.sapi.domain.notification.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponseDto(
	Long id,
	UUID fromId,
	String fromName,
	String message,
	String notificationType,
	LocalDateTime createdDatetime
) {
}
