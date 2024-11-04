package com.seniorcenter.sapi.domain.notification.service;

import java.util.List;
import java.util.UUID;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.seniorcenter.sapi.domain.notification.domain.NotificationType;
import com.seniorcenter.sapi.domain.notification.presentation.dto.response.NotificationResponseDto;
import com.seniorcenter.sapi.domain.user.domain.User;

public interface NotificationService {

	SseEmitter subscribe(String lastEventId);
	void send(User receiver, UUID specificationId, NotificationType notificationType);
	void commentSseTest(Long userId, UUID specificationId);
	List<NotificationResponseDto> getNotifications();
	void removeNotification(Long notificationId);
}
