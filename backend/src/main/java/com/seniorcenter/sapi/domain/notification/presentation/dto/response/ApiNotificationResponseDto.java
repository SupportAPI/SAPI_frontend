package com.seniorcenter.sapi.domain.notification.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ApiNotificationResponseDto(
	Long id,
	UUID fromId,
	UUID workspaceId,
	String fromName,
	String message,
	String notificationType,
	Boolean isRead,
	LocalDateTime createdDatetime
) {
}
