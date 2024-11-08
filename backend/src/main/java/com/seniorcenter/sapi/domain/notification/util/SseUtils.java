package com.seniorcenter.sapi.domain.notification.util;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.seniorcenter.sapi.domain.api.domain.Api;
import com.seniorcenter.sapi.domain.api.domain.repository.ApiRepository;
import com.seniorcenter.sapi.domain.notification.domain.Notification;
import com.seniorcenter.sapi.domain.notification.domain.NotificationMessageBody;
import com.seniorcenter.sapi.domain.notification.domain.NotificationType;
import com.seniorcenter.sapi.domain.notification.domain.repository.EmitterRepository;
import com.seniorcenter.sapi.domain.notification.domain.repository.NotificationRepository;
import com.seniorcenter.sapi.domain.notification.presentation.dto.response.ApiNotificationResponseDto;
import com.seniorcenter.sapi.domain.notification.presentation.dto.response.NotificationResponseDto;
import com.seniorcenter.sapi.domain.specification.domain.repository.SpecificationRepository;
import com.seniorcenter.sapi.domain.user.domain.User;
import com.seniorcenter.sapi.domain.workspace.domain.Workspace;
import com.seniorcenter.sapi.domain.workspace.domain.repository.WorkspaceRepository;
import com.seniorcenter.sapi.global.error.exception.CustomException;
import com.seniorcenter.sapi.global.error.exception.MainException;
import com.seniorcenter.sapi.global.utils.user.UserUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class SseUtils {

	private final EmitterRepository emitterRepository;
	private final NotificationRepository notificationRepository;
	private final WorkspaceRepository workspaceRepository;
	private final ApiRepository apiRepository;
	private final SpecificationRepository specificationRepository;
	private final UserUtils userUtils;

	private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;

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

	public void send(User receiver, UUID fromId, UUID workspaceId, NotificationType notificationType) {
		Notification notification = notificationRepository.save(createNotification(receiver, fromId, notificationType));
		String userId = String.valueOf(receiver.getId());

		NotificationResponseDto responseDto = new NotificationResponseDto(notification.getId(),
			fromId, workspaceId, notification.getFromName(), notification.getMessage(), notificationType.getType(),
			notification.getCreatedDate());

		Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithByUserId(userId);
		sseEmitters.forEach(
			(key, emitter) -> {
				emitterRepository.saveEventCache(key, notification);
				sendToClient(emitter, key, responseDto);
			}
		);
	}

	public void sendApiNotification(User receiver, UUID fromId, UUID workspaceId, NotificationType notificationType) {
		Notification notification = notificationRepository.save(createNotification(receiver, fromId, notificationType));
		String userId = String.valueOf(receiver.getId());

		ApiNotificationResponseDto responseDto = new ApiNotificationResponseDto(notification.getId(), fromId,
			workspaceId, notification.getFromName(), notification.getMessage(), notificationType.getType(),
			notification.getCreatedDate());

		Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithByUserId(userId);
		sseEmitters.forEach(
			(key, emitter) -> {
				emitterRepository.saveEventCache(key, notification);
				sendToClient(emitter, key, responseDto);
			}
		);
	}

	private Notification createNotification(User receiver, UUID fromId, NotificationType notificationType) {
		Notification notification;

		if (notificationType.equals(NotificationType.WORKSPACE_INVITE)) {
			Workspace workspace = workspaceRepository.findById(fromId)
				.orElseThrow(() -> new MainException(CustomException.NOT_FOUND_WORKSPACE));
			String message = workspace.getProjectName() + selectNotificationMessageBody(notificationType);
			notification = Notification.createNotification(receiver, fromId, fromId, workspace.getProjectName(), message, notificationType);
		} else {
			Api api = apiRepository.findById(fromId).orElseThrow(() -> new MainException(CustomException.NOT_FOUND_DOCS));
			String message = api.getName() + selectNotificationMessageBody(notificationType);
			notification = Notification.createNotification(receiver, fromId,
				specificationRepository.findWorkspaceIdByApiId(fromId), api.getName(), message, notificationType);
		}

		return notification;
	}

	private String selectNotificationMessageBody(NotificationType notificationType) {
		if (notificationType.equals(NotificationType.API_CONFIRM)) {
			return NotificationMessageBody.API_CONFIRM.getMessage();
		} else if (notificationType.equals(NotificationType.API_UPDATE)) {
			return NotificationMessageBody.API_UPDATE.getMessage();
		} else if (notificationType.equals(NotificationType.TEST_FAIL)) {
			return NotificationMessageBody.TEST_FAIL.getMessage();
		} else if (notificationType.equals(NotificationType.COMMENT_TAG)) {
			return NotificationMessageBody.COMMENT_TAG.getMessage();
		} else {
			return NotificationMessageBody.WORKSPACE_INVITE.getMessage();
		}
	}

	private void sendToClient(SseEmitter emitter, String emitterId, Object data) {
		try {
			emitter.send(SseEmitter.event()
				.id(emitterId)
				.name("notification")
				.data(data, MediaType.APPLICATION_JSON));
		} catch (IOException e) {
			log.warn("SSE 전송 중 오류 (Broken Pipe): {}", e.getMessage());
			emitterRepository.deleteById(emitterId);
		}
	}
}
