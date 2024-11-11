package com.seniorcenter.sapi.domain.notification.presentation;

import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.seniorcenter.sapi.domain.notification.presentation.dto.request.UpdateNotificationRequestDto;
import com.seniorcenter.sapi.domain.notification.presentation.dto.response.NotificationResponseDto;
import com.seniorcenter.sapi.domain.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

	private final NotificationService notificationService;

	@GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter subscribe(@RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId) {
		return notificationService.subscribe(lastEventId);
	}

	@PostMapping("/sse-test")
	public void publish(@RequestParam Long userId, @RequestParam UUID specificationId) {
		notificationService.commentSseTest(userId, specificationId);
	}

	@GetMapping
	public List<NotificationResponseDto> getNotifications() {
		return notificationService.getNotifications();
	}

	@DeleteMapping("/{notificationId}")
	public void removeNotification(@PathVariable Long notificationId) {
		notificationService.removeNotification(notificationId);
	}

	@PatchMapping
	public void changeReadStatus(@RequestBody UpdateNotificationRequestDto requestDto) {
		notificationService.updateNotification(requestDto);
	}
}
