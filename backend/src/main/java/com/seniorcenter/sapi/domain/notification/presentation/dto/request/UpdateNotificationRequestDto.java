package com.seniorcenter.sapi.domain.notification.presentation.dto.request;

import java.util.List;

public record UpdateNotificationRequestDto(
	List<Long> notificationIds
) {
}
