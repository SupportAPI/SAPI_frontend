package com.seniorcenter.sapi.domain.notification.domain.repository;

import java.util.Map;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface EmitterRepository {

	SseEmitter save(String emitterId, SseEmitter sseEmitter);
	void saveEventCache(String emitterId, Object event);
	Map<String, SseEmitter> findAllEmitterStartWithByUserId(String userId);
	Map<String, Object> fidAllEventCacheStartWithByUserId(String userId);
	void deleteById(String emitterId);
	void deleteAllEmitterStartWithUserId(String userId);
	void deleteAllEventCacheStartWithUserId(String userId);
}
