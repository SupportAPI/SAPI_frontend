package com.seniorcenter.sapi.domain.notification.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.seniorcenter.sapi.domain.notification.domain.Notification;
import com.seniorcenter.sapi.domain.notification.domain.NotificationMessageBody;
import com.seniorcenter.sapi.domain.notification.domain.NotificationType;
import com.seniorcenter.sapi.domain.notification.domain.repository.EmitterRepository;
import com.seniorcenter.sapi.domain.notification.domain.repository.NotificationRepository;
import com.seniorcenter.sapi.domain.notification.presentation.dto.response.NotificationResponseDto;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
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
public class NotificationServiceImpl implements NotificationService {

	private final EmitterRepository emitterRepository;
	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	private final SpecificationRepository specificationRepository;
	private final UserUtils userUtils;

	private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;

	@Override
	public SseEmitter subscribe(String lastEventId) {
		Long userId = userUtils.getUserFromSecurityContext().getId();

		// 고유한 아이디 생성
		String emitterId = userId + "_" + System.currentTimeMillis();
		SseEmitter emitter = emitterRepository.save(emitterId, new SseEmitter(DEFAULT_TIMEOUT));

		// 시간 초과나 비동기 요청이 안되면 자동으로 삭제
		emitter.onCompletion(() -> emitterRepository.deleteById(emitterId));
		emitter.onTimeout(() -> emitterRepository.deleteById(emitterId));

		// 최초 연결 시 더미데이터가 없으면 503 오류가 발생하기 때문에 더미데이터 생성
		sendToClient(emitter, emitterId, "{\"message\": \"EventStream Created.\", \"userId\": " + userId + "}");

		// lastEventId가 있다는 것은 연결이 종료됐다고 판단함. 메모리에 저장된 데이터를 모두 전송.
		if (!lastEventId.isEmpty()) {
			Map<String, Object> events = emitterRepository.fidAllEventCacheStartWithByUserId(String.valueOf(userId));
			events.entrySet().stream()
				.filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
				.forEach(entry -> sendToClient(emitter, entry.getKey(), entry.getValue()));
		}
		return emitter;
	}

	@Override
	public void send(User receiver, UUID specificationId, NotificationType notificationType) {
		Notification notification = notificationRepository.save(createNotification(receiver, specificationId, notificationType));
		String userId = String.valueOf(receiver.getId());

		NotificationResponseDto responseDto = new NotificationResponseDto(notification.getId(),
			specificationId, "테스트~", notification.getMessage(), notification.getCreatedDate());

		Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithByUserId(userId);
		sseEmitters.forEach(
			(key, emitter) -> {
				emitterRepository.saveEventCache(key, notification);
				sendToClient(emitter, key, responseDto);
			}
		);
	}

	@Override
	public void commentSseTest(Long userId, UUID specificationId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_USER_EXCEPTION));
		send(user, specificationId, NotificationType.COMMENT_TAG);
	}

	private Notification createNotification(User receiver, UUID specificationId, NotificationType notificationType) {
		// TODO: apiId로 apiRepository에서 api를 가져온 뒤, api 명을 메시지에 추가
		String message = "임시API명" + selectNotificationMessageBody(notificationType);
		return Notification.createNotification(receiver, specificationId, "테스트123", message, notificationType);
	}

	private String selectNotificationMessageBody(NotificationType notificationType) {
		if (notificationType.equals(NotificationType.API_CONFIRM)) {
			return NotificationMessageBody.API_CONFIRM.getMessage();
		} else if (notificationType.equals(NotificationType.API_UPDATE)) {
			return NotificationMessageBody.API_UPDATE.getMessage();
		} else if (notificationType.equals(NotificationType.TEST_FAIL)) {
			return NotificationMessageBody.TEST_FAIL.getMessage();
		} else {
			return NotificationMessageBody.COMMENT_TAG.getMessage();
		}
	}

	private void sendToClient(SseEmitter emitter, String emitterId, Object data) {
		try {
			emitter.send(SseEmitter.event()
				.id(emitterId)
				.name("notification")
				.data(data, MediaType.APPLICATION_JSON));
		} catch (IOException e) {
			log.error(e.getMessage());
			emitterRepository.deleteById(emitterId);
			throw new MainException(CustomException.FAIL_TO_SEND_NOTIFICATION);
		}
	}

	@Override
	public List<NotificationResponseDto> getNotifications() {
		User user = userUtils.getUserFromSecurityContext();
		List<Notification> notifications = notificationRepository.findByUserId(user.getId());

		return notifications.stream()
			.map(notification -> new NotificationResponseDto(
				notification.getId(),
				notification.getSpecificationId(),
				notification.getApiName(),
				notification.getMessage(),
				notification.getCreatedDate()
			))
			.collect(Collectors.toList());
	}

	@Override
	public void removeNotification(Long notificationId) {
		User user = userUtils.getUserFromSecurityContext();
		Notification notification = notificationRepository.findById(notificationId)
			.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_NOTIFICATION));

		if (!user.getId().equals(notification.getUser().getId())) {
			throw new MainException(CustomException.ACCESS_DENIED_EXCEPTION);
		}

		notificationRepository.deleteById(notificationId);
	}
}
