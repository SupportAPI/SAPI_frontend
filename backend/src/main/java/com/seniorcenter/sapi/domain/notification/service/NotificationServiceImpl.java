package com.seniorcenter.sapi.domain.notification.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.seniorcenter.sapi.domain.notification.domain.Notification;
import com.seniorcenter.sapi.domain.notification.domain.NotificationType;
import com.seniorcenter.sapi.domain.notification.domain.repository.NotificationRepository;
import com.seniorcenter.sapi.domain.notification.presentation.dto.request.UpdateNotificationRequestDto;
import com.seniorcenter.sapi.domain.notification.presentation.dto.response.NotificationResponseDto;
import com.seniorcenter.sapi.domain.notification.util.SseUtils;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.user.domain.repository.UserRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.UserUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class NotificationServiceImpl implements NotificationService {

	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	private final UserUtils userUtils;
	private final SseUtils sseUtils;

	@Override
	public SseEmitter subscribe(String lastEventId) {
		return sseUtils.subscribe(lastEventId);
	}

	@Override
	public void commentSseTest(Long userId, UUID specificationId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
		// sseUtils.send(user, specificationId, NotificationType.COMMENT_TAG);
	}

	@Override
	public List<NotificationResponseDto> getNotifications() {
		User user = userUtils.getUserFromSecurityContext();
		List<Notification> notifications = notificationRepository.findByUserId(user.getId());

		return notifications.stream()
			.map(notification -> new NotificationResponseDto(
				notification.getId(),
				notification.getFromId(),
				notification.getWorkspaceId(),
				notification.getFromName(),
				notification.getMessage(),
				notification.getType(),
				notification.getIsRead(),
				notification.getCreatedDate()
			))
			.collect(Collectors.toList());
	}

	@Override
	@Transactional
	public void removeNotification(Long notificationId) {
		User user = userUtils.getUserFromSecurityContext();
		Notification notification = notificationRepository.findById(notificationId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_NOTIFICATION));

		if (!user.getId().equals(notification.getUser().getId())) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		notificationRepository.deleteById(notificationId);
	}

	@Override
	@Transactional
	public void updateNotification(UpdateNotificationRequestDto requestDto) {
		List<Long> notificationIds = requestDto.notificationIds();
		List<Notification> notifications = notificationRepository.findAllById(notificationIds);
		notifications.forEach(Notification::changeReadStatus);
	}
}
